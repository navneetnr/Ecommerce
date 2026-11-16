package com.ecommerce.analytics.benchmark

import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.functions._

case class BenchmarkPoint(
  tierName: String,
  recordCount: Long,
  processingTimeSec: Double,
  throughputRecsPerSec: Long
)

object ScalabilityBenchmark {

  def runScalabilityExperiment(transactionDF: DataFrame): Seq[BenchmarkPoint] = {
    val totalCount = transactionDF.count()
    val sliceSizes = Seq(
      ("Small", Math.min(10000L, totalCount)),
      ("Medium", Math.min(50000L, totalCount)),
      ("Large", Math.min(100000L, totalCount)),
      ("Full Cluster", totalCount)
    )

    sliceSizes.map { case (tier, targetCount) =>
      val sliceDF = if (targetCount >= totalCount) transactionDF else transactionDF.limit(targetCount.toInt)
      
      val startTime = System.nanoTime()
      
      // Perform distributed aggregation workload (GroupBy, Aggregation, and Sorting)
      val _ = sliceDF
        .groupBy("StockCode")
        .agg(
          sum("Quantity").alias("TotalQuantity"),
          round(sum("TotalAmount"), 2).alias("TotalRevenue")
        )
        .orderBy(desc("TotalQuantity"))
        .collect()

      val endTime = System.nanoTime()
      val durationSec = (endTime - startTime) / 1e9
      val throughput = if (durationSec > 0) (targetCount / durationSec).toLong else 0L

      BenchmarkPoint(
        tierName = tier,
        recordCount = targetCount,
        processingTimeSec = durationSec,
        throughputRecsPerSec = throughput
      )
    }
  }
}
