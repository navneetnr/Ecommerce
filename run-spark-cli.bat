@echo off
setlocal
echo ==============================================================
echo  RUNNING SPARK BATCH ANALYTICS AND RECOMMENDATION PIPELINE
echo  INT315 Cluster Computing - Apache Spark 3.5.1 on Scala 2.12
echo ==============================================================

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "HADOOP_HOME=C:\winutils"
set "PATH=%JAVA_HOME%\bin;C:\apache-maven-3.9.11\bin;%PATH%"

set MAVEN_OPTS=--add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.invoke=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-opens=java.base/java.net=ALL-UNNAMED --add-opens=java.base/java.nio=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.base/java.util.concurrent.atomic=ALL-UNNAMED --add-opens=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/sun.nio.cs=ALL-UNNAMED --add-opens=java.base/sun.security.action=ALL-UNNAMED --add-opens=java.base/sun.util.calendar=ALL-UNNAMED --add-opens=java.security.jgss/sun.security.krb5=ALL-UNNAMED

cd /d "d:\Ecommerce\spark-engine"
mvn exec:java "-Dexec.mainClass=com.ecommerce.analytics.SparkApp"
endlocal
