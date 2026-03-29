import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Job } from '../App';
import { api, type AIAnalysisResponse } from '../services/api';

interface JobCardProps {
  job: Job;
  isDark: boolean;
}

export function JobCard({ job, isDark }: JobCardProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Mock job description for now, could be an input later
      const result = await api.analyzeStudent(job.id, "Looking for a software engineer with strong technical skills and problem solving ability.");
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('AI Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-[#1a1d29] border-gray-800' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:border-purple-500/50 transition-all shadow-lg flex flex-col h-full`}>
      {/* Name and Email */}
      <div className="mb-4">
        <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.name}</h3>
        <p className="text-gray-400 text-sm">{job.email}</p>
        <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mt-2`}>CGPA: {job.cgpa}</p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.map((skill, index) => (
          <span
            key={index}
            className={`px-3 py-1 ${isDark ? 'bg-purple-900/40 text-purple-300 border-purple-700/50' : 'bg-purple-100 text-purple-700 border-purple-300'} rounded-full text-sm border`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} border ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">Match Score</span>
            <span className={`text-lg font-bold ${analysis.matchScore > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
              {analysis.matchScore}%
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Verdict</p>
              <div className="flex items-start gap-2">
                {analysis.matchScore > 70 ? (
                  <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{analysis.hiringVerdict}</p>
              </div>
            </div>

            {analysis.missingSkills.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.missingSkills.map((skill, index) => (
                    <span key={index} className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`w-full py-3 bg-gradient-to-r ${isAnalyzing ? 'from-gray-500 to-gray-600 cursor-not-allowed' : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-white`}
        >
          {isAnalyzing ? (
            <>
              Analyzing...
              <Loader2 size={16} className="animate-spin" />
            </>
          ) : (
            <>
              {analysis ? 'Re-analyze Match' : 'Analyze Match'}
              <Sparkles size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}