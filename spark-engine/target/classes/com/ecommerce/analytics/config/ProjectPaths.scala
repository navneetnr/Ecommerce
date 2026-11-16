package com.ecommerce.analytics.config

import java.io.File

object ProjectPaths {
  private def projectRoot: File = {
    val configured = sys.env.get("ECOMMERCE_HOME").map(new File(_))
    configured.filter(_.isDirectory).getOrElse {
      Iterator.iterate(new File(System.getProperty("user.dir")))(_.getParentFile)
        .takeWhile(_ != null)
        .find(dir => new File(dir, "data/raw/online_retail.csv").isFile)
        .getOrElse(new File(System.getProperty("user.dir")))
    }
  }

  def rawDataset: String = sys.env.getOrElse("ECOMMERCE_DATA_PATH", new File(projectRoot, "data/raw/online_retail.csv").getPath)
  def processedDirectory: String = sys.env.getOrElse("ECOMMERCE_PROCESSED_DIR", new File(projectRoot, "data/processed").getPath)
  def warehouseDirectory: String = new File(projectRoot, "data/warehouse").getPath
}
