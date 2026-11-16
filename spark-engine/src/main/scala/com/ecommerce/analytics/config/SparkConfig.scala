package com.ecommerce.analytics.config

import org.apache.spark.sql.SparkSession
import java.io.File

object SparkConfig {

  // Bypass Hadoop Windows NativeIO UnsatisfiedLinkError
  private def bypassHadoopNativeIO(): Unit = {
    try {
      val nativeIOClass = Class.forName("org.apache.hadoop.io.nativeio.NativeIO")
      val field = nativeIOClass.getDeclaredField("nativeLoaded")
      field.setAccessible(true)
      field.setBoolean(null, false)
      println("[SparkConfig] Windows NativeIO bypass applied (pure Java File fallback active).")
    } catch {
      case t: Throwable =>
        // Continue silently if field not accessible
    }
  }

  def getOrCreateSparkSession(appName: String = "ECommerceAnalytics"): SparkSession = {
    // Windows Hadoop winutils configuration
    val osName = System.getProperty("os.name", "").toLowerCase
    if (osName.contains("win")) {
      val winutilsPath = "C:\\winutils"
      if (new File(winutilsPath).exists()) {
        System.setProperty("hadoop.home.dir", winutilsPath)
      }
      bypassHadoopNativeIO()
    }

    val spark = SparkSession.builder()
      .appName(appName)
      .master("local[*]")
      .config("spark.sql.shuffle.partitions", "16")
      .config("spark.driver.memory", "4g")
      .config("spark.sql.warehouse.dir", ProjectPaths.warehouseDirectory)
      .config("spark.ui.enabled", "false")
      .getOrCreate()

    bypassHadoopNativeIO()
    spark.sparkContext.setLogLevel("WARN")
    spark
  }
}
