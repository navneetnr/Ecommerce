package com.ecommerce.analytics.graph

import org.apache.spark.graphx._
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.DataFrame

case class GraphAnalysisResult(
  totalVertices: Long,
  customerCount: Long,
  productCount: Long,
  totalEdges: Long,
  topDegreeProducts: Seq[(String, Int)],
  topPageRankProducts: Seq[(String, Double)]
)

object GraphXEngine {

  // Separate customer and product IDs so they can never share an ID namespace.
  val PRODUCT_ID_OFFSET = 1000000000L

  def buildAndAnalyzeGraph(transactionDF: DataFrame): GraphAnalysisResult = {
    // 1. Create customer vertices (PDF Section 11)
    val customerIds: RDD[(String, VertexId)] = transactionDF
      .select("CustomerID")
      .distinct()
      .rdd
      .map(_.getAs[Any]("CustomerID").toString)
      .zipWithIndex()
      .map { case (rawId, index) => (rawId, index + 1L) }

    // 2. Create product vertices (PDF Section 11)
    val productIds: RDD[(String, VertexId)] = transactionDF
      .select("StockCode")
      .distinct()
      .rdd
      .map(_.getAs[Any]("StockCode").toString)
      .zipWithIndex()
      .map { case (rawId, index) => (rawId, index + PRODUCT_ID_OFFSET + 1L) }

    // Combine them (PDF Section 11)
    val customerVertices: RDD[(VertexId, String)] = customerIds.map { case (rawId, id) => (id, "Customer:" + rawId) }
    val productVertices: RDD[(VertexId, String)] = productIds.map { case (rawId, id) => (id, "Product:" + rawId) }
    val vertices: RDD[(VertexId, String)] = customerVertices.union(productVertices)

    // 3. Create edges (PDF Section 12)
    val purchases = transactionDF.select("CustomerID", "StockCode").rdd.map { row =>
      (row.getAs[Any]("CustomerID").toString, row.getAs[Any]("StockCode").toString)
    }
    val edges: RDD[Edge[String]] = purchases
      .map { case (customer, product) => (customer, product) }
      .join(customerIds)
      .map { case (_, (product, customerVertex)) => (product, customerVertex) }
      .join(productIds)
      .map { case (_, (customerVertex, productVertex)) => Edge(customerVertex, productVertex, "PURCHASED") }

    // 4. Create Graph (PDF Section 13)
    val graph: Graph[String, String] = Graph(vertices, edges)

    val totalV = graph.vertices.count()
    val totalE = graph.edges.count()
    val custV = customerVertices.count()
    val prodV = productVertices.count()

    // 5. Degree Analysis & Popular Products (PDF Section 14 & 15)
    val productDegrees = graph.degrees
      .join(graph.vertices)
      .filter { case (_, (_, label)) => label.startsWith("Product:") }
      .map { case (_, (degree, label)) => (label.replace("Product:", ""), degree) }
      .sortBy(_._2, ascending = false)
      .take(10)

    // 6. PageRank Algorithm (PDF Section 16)
    val ranks: VertexRDD[Double] = graph.pageRank(0.001).vertices

    val rankedProducts = ranks
      .join(graph.vertices)
      .filter { case (_, (_, label)) => label.startsWith("Product:") }
      .map { case (_, (rankScore, label)) => (label.replace("Product:", ""), rankScore) }
      .sortBy(_._2, ascending = false)
      .take(10)

    GraphAnalysisResult(
      totalVertices = totalV,
      customerCount = custV,
      productCount = prodV,
      totalEdges = totalE,
      topDegreeProducts = productDegrees,
      topPageRankProducts = rankedProducts
    )
  }
}
