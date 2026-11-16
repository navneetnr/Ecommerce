package com.ecommerce.analytics.sql

import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.functions._

object AnalyticsQueries {

  /**
   * PDF Section 9: Find top-selling products by quantity and revenue
   */
  def getTopSellingProducts(transactionDF: DataFrame, limit: Int = 10): DataFrame = {
    transactionDF
      .groupBy("StockCode", "Description")
      .agg(
        sum("Quantity").alias("TotalQuantity"),
        round(sum("TotalAmount"), 2).alias("TotalRevenue"),
        round(avg("UnitPrice"), 2).alias("UnitPrice")
      )
      .orderBy(desc("TotalQuantity"))
      .limit(limit)
  }

  /**
   * PDF Section 9: Find high-value customers
   */
  def getHighValueCustomers(transactionDF: DataFrame, limit: Int = 10): DataFrame = {
    transactionDF
      .groupBy("CustomerID", "Country")
      .agg(
        round(sum("TotalAmount"), 2).alias("TotalSpent"),
        countDistinct("StockCode").alias("UniqueProducts"),
        count("InvoiceNo").alias("TotalTransactions")
      )
      .orderBy(desc("TotalSpent"))
      .limit(limit)
  }

  /**
   * Country-wise sales distribution
   */
  def getCountrySales(transactionDF: DataFrame, limit: Int = 10): DataFrame = {
    transactionDF
      .groupBy("Country")
      .agg(
        round(sum("TotalAmount"), 2).alias("TotalRevenue"),
        count("InvoiceNo").alias("Transactions"),
        countDistinct("CustomerID").alias("UniqueCustomers")
      )
      .orderBy(desc("TotalRevenue"))
      .limit(limit)
  }

  /**
   * High-level summary metrics
   */
  def getSummaryMetrics(transactionDF: DataFrame): Map[String, Any] = {
    val revRow = transactionDF.agg(round(sum("TotalAmount"), 2)).first()
    val totalRevenue = if (revRow == null || revRow.isNullAt(0)) 0.0 else revRow.getDouble(0)
    val totalOrders = transactionDF.select("InvoiceNo").distinct().count()
    val totalCustomers = transactionDF.select("CustomerID").distinct().count()
    val totalProducts = transactionDF.select("StockCode").distinct().count()
    val totalRows = transactionDF.count()
    val avgOrderValue = if (totalOrders > 0) totalRevenue / totalOrders else 0.0

    Map(
      "totalRevenue" -> totalRevenue,
      "totalOrders" -> totalOrders,
      "totalCustomers" -> totalCustomers,
      "totalProducts" -> totalProducts,
      "totalRecords" -> totalRows,
      "avgOrderValue" -> avgOrderValue
    )
  }
}
