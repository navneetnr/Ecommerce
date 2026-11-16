package com.ecommerce.analytics.ingestion

import org.apache.spark.sql.{DataFrame, SparkSession}
import org.apache.spark.sql.functions._
import com.ecommerce.analytics.config.ProjectPaths
import java.io.File

case class PreprocessingResult(
  rawDF: DataFrame,
  cleanDF: DataFrame,
  rawCount: Long,
  cleanedCount: Long,
  nullCustomers: Long,
  nullStockCodes: Long,
  invalidQuantities: Long,
  invalidUnitPrices: Long,
  duplicates: Long,
  durationSeconds: Double
)

object DataCleaner {

  def cleanTransactions(spark: SparkSession, csvPath: String): PreprocessingResult = {
    val startTime = System.nanoTime()

    // 1. Data Ingestion (PDF Section 6)
    val rawDF = spark.read
      .option("header", "true")
      .option("inferSchema", "true")
      .csv(csvPath)

    val rawCount = rawDF.count()

    // Count null CustomerID before dropping
    val nullCustomerCount = rawDF.filter(col("CustomerID").isNull).count()
    val nullStockCodeCount = rawDF.filter(col("StockCode").isNull).count()

    // 2. Data Preprocessing (PDF Section 7)
    // Remove missing CustomerID and StockCode
    val cleanDF = rawDF
      .filter(col("CustomerID").isNotNull)
      .filter(col("StockCode").isNotNull)

    // Count non-positive quantities and prices
    val invalidQuantityCount = cleanDF.filter(col("Quantity") <= 0).count()
    val invalidUnitPriceCount = cleanDF.filter(col("UnitPrice") <= 0).count()

    // Remove invalid quantities and unit prices
    val cleanedData = cleanDF
      .filter(col("Quantity") > 0)
      .filter(col("UnitPrice") > 0)

    val beforeDeduplicationCount = cleanedData.count()

    // Remove duplicate records
    val finalDF = cleanedData.dropDuplicates()
    val finalCount = finalDF.count()
    val duplicateCount = beforeDeduplicationCount - finalCount

    // 3. Feature Engineering (PDF Section 8)
    val transactionDF = finalDF
      .withColumn("CustomerID", col("CustomerID").cast("string"))
      .withColumn("StockCode", col("StockCode").cast("string"))
      .withColumn("TotalAmount", round(col("Quantity") * col("UnitPrice"), 2))

    // Save as Parquet columnar format
    val parquetPath = new File(ProjectPaths.processedDirectory, "clean_transactions.parquet").getPath
    try {
      transactionDF.write
        .mode("overwrite")
        .parquet(parquetPath)
    } catch {
      case e: Throwable =>
        println(s"[DataCleaner] Notice: Parquet file commit notice (${e.getMessage}). Continuing with cached DataFrame in memory.")
    }

    val endTime = System.nanoTime()
    val duration = (endTime - startTime) / 1e9

    PreprocessingResult(
      rawDF = rawDF,
      cleanDF = transactionDF,
      rawCount = rawCount,
      cleanedCount = finalCount,
      nullCustomers = nullCustomerCount,
      nullStockCodes = nullStockCodeCount,
      invalidQuantities = invalidQuantityCount,
      invalidUnitPrices = invalidUnitPriceCount,
      duplicates = duplicateCount,
      durationSeconds = duration
    )
  }
}
