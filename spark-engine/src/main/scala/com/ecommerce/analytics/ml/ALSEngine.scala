package com.ecommerce.analytics.ml

import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.functions._
import org.apache.spark.ml.feature.StringIndexer
import org.apache.spark.ml.recommendation.{ALS, ALSModel}
import org.apache.spark.ml.evaluation.RegressionEvaluator

case class ALSEvaluationResult(
  rmse: Double,
  trainCount: Long,
  testCount: Long,
  trainingTimeSeconds: Double,
  rank: Int,
  maxIter: Int,
  regParam: Double,
  model: ALSModel,
  userMapping: Map[Int, String],
  itemMapping: Map[Int, String]
)

object ALSEngine {

  def trainAndEvaluateALS(transactionDF: DataFrame): ALSEvaluationResult = {
    val startTime = System.nanoTime()

    // PDF Section 18: StringIndexer for CustomerID and StockCode
    val userIndexer = new StringIndexer()
      .setInputCol("CustomerID")
      .setOutputCol("userId")
      .setHandleInvalid("skip")

    val productIndexer = new StringIndexer()
      .setInputCol("StockCode")
      .setOutputCol("itemId")
      .setHandleInvalid("skip")

    val userIndexerModel = userIndexer.fit(transactionDF)
    val indexedUser = userIndexerModel.transform(transactionDF)

    val productIndexerModel = productIndexer.fit(indexedUser)
    val indexedData = productIndexerModel.transform(indexedUser)

    // Build reverse index lookups (int -> original string ID)
    val userLabels = userIndexerModel.labels
    val itemLabels = productIndexerModel.labels
    val userMapping = userLabels.indices.map(i => (i, userLabels(i))).toMap
    val itemMapping = itemLabels.indices.map(i => (i, itemLabels(i))).toMap

    // PDF Section 19: Prepare ALS input
    val ratings = indexedData.select(
      col("userId").cast("int"),
      col("itemId").cast("int"),
      col("Quantity").cast("float").alias("rating")
    )

    // 80% Training, 20% Testing split
    val Array(training, testing) = ratings.randomSplit(Array(0.8, 0.2), seed = 42L)
    val trainCount = training.count()
    val testCount = testing.count()

    // PDF Section 20: Build ALS Recommendation Model
    val als = new ALS()
      .setUserCol("userId")
      .setItemCol("itemId")
      .setRatingCol("rating")
      .setColdStartStrategy("drop")
      .setRank(10)
      .setMaxIter(10)
      .setRegParam(0.1)

    val model = als.fit(training)
    val endTime = System.nanoTime()
    val trainTime = (endTime - startTime) / 1e9

    // PDF Section 22: Evaluate model with RMSE
    val predictions = model.transform(testing)

    val evaluator = new RegressionEvaluator()
      .setMetricName("rmse")
      .setLabelCol("rating")
      .setPredictionCol("prediction")

    val rmse = evaluator.evaluate(predictions)

    ALSEvaluationResult(
      rmse = if (rmse.isNaN || rmse.isInfinity) {
        throw new IllegalStateException("ALS evaluation produced an invalid RMSE. Check the training/test split and cold-start handling.")
      } else rmse,
      trainCount = trainCount,
      testCount = testCount,
      trainingTimeSeconds = trainTime,
      rank = 10,
      maxIter = 10,
      regParam = 0.1,
      model = model,
      userMapping = userMapping,
      itemMapping = itemMapping
    )
  }

  /**
   * PDF Section 21: Generate recommendations for all customers
   */
  def generateTopNRecommendations(model: ALSModel, n: Int = 5): DataFrame = {
    model.recommendForAllUsers(n)
  }
}
