@echo off
echo =======================================================================
echo  INTELLIGENT E-COMMERCE ANALYTICS & RECOMMENDATION SYSTEM
echo  INT315 Cluster Computing - Academic Final Year Project
echo =======================================================================
echo.
echo Launching Spark REST API Service in new window...
start "Spark REST API Server (Port 8080)" cmd /k "d:\Ecommerce\run-spark-server.bat"

echo Launching React Premium SaaS Dashboard in new window...
start "React Frontend (Port 5173)" cmd /k "d:\Ecommerce\run-frontend.bat"

echo.
echo Both services are starting!
echo -> Frontend Dashboard : http://localhost:5173
echo -> Backend Spark API  : http://localhost:8080/api/status
echo.
echo Press any key to exit this launcher window.
pause > nul
