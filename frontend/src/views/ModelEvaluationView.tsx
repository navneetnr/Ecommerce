import React from 'react';
import { Gauge, CheckCircle2, TrendingUp, Cpu, BookOpen, Code } from 'lucide-react';
import { ModelEvaluation } from '../types';

interface ModelEvalProps {
  evaluation: ModelEvaluation;
}

export const ModelEvaluationView: React.FC<ModelEvalProps> = ({ evaluation }) => {
  return (
    <div className="space-y-6">
      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Root Mean Square Error</span>
            <Gauge className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-brand-600">
            {evaluation.rmse.toFixed(4)}
          </div>
          <div className="text-[11px] text-status-success font-medium mt-1">
            ✓ Lower RMSE = Higher Precision
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Training Records (80%)</span>
            <CheckCircle2 className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-bold font-mono text-content-primary">
            {evaluation.trainRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Random split seed = 42
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Testing Records (20%)</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-content-primary">
            {evaluation.testRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Unseen validation interactions
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Training Time</span>
            <Cpu className="w-4 h-4 text-status-warning" />
          </div>
          <div className="text-2xl font-bold font-mono text-status-warning">
            {evaluation.trainingTimeSec}s
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            10 distributed ALS iterations
          </div>
        </div>
      </div>

      {/* Hyperparameters & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
          <h3 className="text-sm font-semibold text-content-primary mb-3">
            ALS Model Hyperparameter Configuration
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-border-subtle">
              <span className="text-content-secondary">Latent Factors (Rank):</span>
              <span className="font-mono font-bold text-content-primary">
                {evaluation.rank} Dimensions
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-subtle">
              <span className="text-content-secondary">Maximum Iterations:</span>
              <span className="font-mono font-bold text-content-primary">
                {evaluation.maxIter} Cycles
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-subtle">
              <span className="text-content-secondary">Regularization Parameter (λ):</span>
              <span className="font-mono font-bold text-content-primary">
                {evaluation.regParam}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-subtle">
              <span className="text-content-secondary">Cold-Start Strategy:</span>
              <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                {evaluation.coldStartStrategy}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-content-secondary">User/Item Identifier Encoding:</span>
              <span className="font-mono font-medium text-content-primary">
                Spark StringIndexer Dense Int
              </span>
            </div>
          </div>
        </div>

        {/* Academic Evaluation Metric Explanation */}
        <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-content-primary">
                Metric Formulation & Interpretation
              </h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              In INT315 Cluster Computing, collaborative filtering evaluation uses the{' '}
              <strong className="text-content-primary">RegressionEvaluator</strong> on the 20% holdout test split.
            </p>
            <div className="my-3 p-3 bg-surface-muted rounded-md border border-border-subtle font-mono text-center text-xs text-content-primary">
              RMSE = √[ (1/N) × Σ (Rating_actual - Rating_predicted)² ]
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Setting <span className="font-mono text-content-primary">coldStartStrategy("drop")</span> ensures that any testing interactions containing customer or product IDs that never appeared in the 80% training split do not produce <span className="font-mono text-content-primary">NaN</span> evaluations.
            </p>
          </div>

          <div className="text-[11px] text-content-tertiary pt-3 border-t border-border-subtle">
            Evaluated via org.apache.spark.ml.evaluation.RegressionEvaluator
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-[#1E1E1E] text-white rounded-lg p-5 shadow-card font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-3">
          <div className="flex items-center gap-2 text-gray-300">
            <Code className="w-4 h-4 text-brand-500" />
            <span>Spark MLlib ALS & Evaluator Implementation (ALSEngine.scala)</span>
          </div>
          <span className="text-[11px] text-gray-400">Spark MLlib Pipeline</span>
        </div>
        <pre className="text-gray-300 overflow-x-auto leading-relaxed">
{`import org.apache.spark.ml.recommendation.ALS
import org.apache.spark.ml.evaluation.RegressionEvaluator

// 1. Configure Alternating Least Squares
val als = new ALS()
  .setUserCol("userId")
  .setItemCol("itemId")
  .setRatingCol("rating")
  .setColdStartStrategy("drop")
  .setRank(10)
  .setMaxIter(10)
  .setRegParam(0.1)

// 2. Fit model on 80% training split
val model = als.fit(training)

// 3. Transform 20% testing split to compute predictions
val predictions = model.transform(testing)

// 4. Evaluate Root Mean Square Error
val evaluator = new RegressionEvaluator()
  .setMetricName("rmse")
  .setLabelCol("rating")
  .setPredictionCol("prediction")

val rmse = evaluator.evaluate(predictions)
println(s"ALS Evaluation RMSE = $rmse")`}
        </pre>
      </div>
    </div>
  );
};
