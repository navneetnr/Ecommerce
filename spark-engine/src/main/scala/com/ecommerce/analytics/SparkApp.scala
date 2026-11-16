package com.ecommerce.analytics

import com.ecommerce.analytics.config.SparkConfig
import com.ecommerce.analytics.ingestion.DataCleaner
import com.ecommerce.analytics.sql.AnalyticsQueries
import com.ecommerce.analytics.graph.GraphXEngine
import com.ecommerce.analytics.ml.ALSEngine
import com.ecommerce.analytics.benchmark.ScalabilityBenchmark
import com.ecommerce.analytics.config.ProjectPaths

object SparkApp {

  def main(args: Array[String]): Unit = {
    println("==========================================================")
    println(" INTELLIGENT E-COMMERCE ANALYTICS & RECOMMENDATION SYSTEM ")
    println(" INT315 Cluster Computing - Final Year B.Tech CSE Project ")
    println("==========================================================")

    val overallStart = System.nanoTime()

    // 1. Initialize SparkSession (PDF Section 5)
    println("\n[1/6] Initializing Apache Spark Master local[*]")
    val spark = SparkConfig.getOrCreateSparkSession("EcommerceAnalyticsApp")

    // Input dataset selection (sample or full)
    val inputPath = args.find(!_.startsWith("-")).getOrElse {
      val fullPath = ProjectPaths.rawDataset
      if (new java.io.File(fullPath).exists()) fullPath
      else throw new java.io.FileNotFoundException(
        s"Dataset not found at $fullPath. Set ECOMMERCE_DATA_PATH or place online_retail.csv in data/raw."
      )
    }

    println(s"Using dataset: $inputPath")

    // 2. Data Ingestion & Preprocessing (PDF Sections 6, 7, 8)
    println("\n[2/6] Running Data Ingestion & Preprocessing...")
    val prepResult = DataCleaner.cleanTransactions(spark, inputPath)
    println(s"-> Raw records: ${prepResult.rawCount}")
    println(s"-> Filtered null CustomerIDs: ${prepResult.nullCustomers}")
    println(s"-> Cleaned Parquet records: ${prepResult.cleanedCount} (Took ${prepResult.durationSeconds.formatted("%.2f")}s)")

    val cleanDF = prepResult.cleanDF

    // 3. Spark SQL Distributed Analytics (PDF Section 9)
    println("\n[3/6] Executing Spark SQL Analytics...")
    val summary = AnalyticsQueries.getSummaryMetrics(cleanDF)
    val topProductsDF = AnalyticsQueries.getTopSellingProducts(cleanDF, 5)
    val topCustomersDF = AnalyticsQueries.getHighValueCustomers(cleanDF, 5)

    println("-> Top 5 Selling Products:")
    topProductsDF.show(false)

    println("-> Top 5 High-Value Customers:")
    topCustomersDF.show(false)

    // 4. GraphX Implementation (PDF Sections 10-16)
    println("\n[4/6] Constructing GraphX Customer-Product Bipartite Graph & PageRank...")
    val graphResult = GraphXEngine.buildAndAnalyzeGraph(cleanDF)
    println(s"-> Vertices: ${graphResult.totalVertices} (${graphResult.customerCount} Users, ${graphResult.productCount} Products)")
    println(s"-> Edges: ${graphResult.totalEdges} Purchases")
    println("-> Top Products by Degree Centrality:")
    graphResult.topDegreeProducts.take(3).foreach { case (prod, deg) =>
      println(s"   * StockCode: $prod, Degree: $deg")
    }
    println("-> Top Products by PageRank:")
    graphResult.topPageRankProducts.take(3).foreach { case (prod, pr) =>
      println(s"   * StockCode: $prod, PageRank: ${pr.formatted("%.4f")}")
    }

    // 5. Machine Learning ALS Recommendations (PDF Sections 17-22)
    println("\n[5/6] Training Spark MLlib ALS Recommendation Model (80/20 Split)...")
    val alsResult = ALSEngine.trainAndEvaluateALS(cleanDF)
    println(s"-> ALS Model Rank: ${alsResult.rank}, MaxIter: ${alsResult.maxIter}, RegParam: ${alsResult.regParam}")
    println(s"-> Holdout Test RMSE: ${alsResult.rmse.formatted("%.4f")}")
    println(s"-> Training duration: ${alsResult.trainingTimeSeconds.formatted("%.2f")}s")

    // 6. Scalability Benchmark (PDF Sections 23-24)
    println("\n[6/6] Measuring Distributed Scalability Performance...")
    val benchmarkPoints = ScalabilityBenchmark.runScalabilityExperiment(cleanDF)
    benchmarkPoints.foreach { bp =>
      println(s"   * ${bp.tierName.padTo(12, ' ')} : ${bp.recordCount} recs -> ${bp.processingTimeSec.formatted("%.2f")}s (${bp.throughputRecsPerSec} recs/s)")
    }

    val overallEnd = System.nanoTime()
    val totalTime = (overallEnd - overallStart) / 1e9

    // Academic Final Report Formatting (PDF Section 26)
    println("\n" + "=" * 58)
    println("             E-COMMERCE ANALYTICS FINAL REPORT            ")
    println("=" * 58)
    println(s"Total Transactions         : ${prepResult.rawCount}")
    println(s"Total Cleaned Records      : ${prepResult.cleanedCount}")
    println(s"Total Customers (Vertices) : ${summary("totalCustomers")}")
    println(s"Total Products  (Vertices) : ${summary("totalProducts")}")
    println(s"Total Revenue Generated    : $$${summary("totalRevenue")}")
    println(s"Average Order Value        : $$${summary("avgOrderValue").asInstanceOf[Double].formatted("%.2f")}")
    println("-" * 58)
    println("GraphX Analysis:")
    println(s"Most Connected Product     : ${graphResult.topDegreeProducts.headOption.map(_._1).getOrElse("N/A")}")
    println(s"Highest PageRank Product   : ${graphResult.topPageRankProducts.headOption.map(_._1).getOrElse("N/A")}")
    println("-" * 58)
    println("Machine Learning (Spark MLlib):")
    println("Algorithm                  : Alternating Least Squares (ALS)")
    println("Training Data Ratio        : 80%")
    println("Testing Data Ratio         : 20%")
    println(s"Model Evaluation RMSE      : ${alsResult.rmse.formatted("%.4f")}")
    println("-" * 58)
    println(s"Total Execution Time       : ${totalTime.formatted("%.2f")} seconds")
    println("=" * 58)

    spark.stop()
  }
}
