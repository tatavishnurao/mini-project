import { useState, useEffect } from 'react';
import { JobCard } from './components/JobCard';
import { AddJobModal } from './components/AddJobModal';
import { Plus, Moon, Sun } from 'lucide-react';
import { api } from './services/api';

export interface Job {
  id: string;
  name: string;
  email: string;
  cgpa: number;
  skills: string[];
}

const initialJobs: Job[] = [
  {
    id: '1',
    name: 'Ryuu Kageyama',
    email: 'ryuu.kageyama@placement.jp',
    cgpa: 9.2,
    skills: ['Java', 'Spring Boot', 'Kubernetes']
  },
  {
    id: '2',
    name: 'Haruto Shinkai',
    email: 'haruto.shinkai@placement.jp',
    cgpa: 8.7,
    skills: ['Python', 'Machine Learning', 'TensorFlow']
  },
  {
    id: '3',
    name: 'Akira Mizushima',
    email: 'akira.mizushima@placement.jp',
    cgpa: 9.5,
    skills: ['React', 'TypeScript', 'GraphQL']
  },
  {
    id: '4',
    name: 'Sora Kurosawa',
    email: 'sora.kurosawa@placement.jp',
    cgpa: 8.1,
    skills: ['C++', 'Embedded Systems', 'RTOS']
  },
  {
    id: '5',
    name: 'Kaito Fujiwara',
    email: 'kaito.fujiwara@placement.jp',
    cgpa: 9,
    skills: ['Go', 'Microservices', 'Docker']
  },
  {
    id: '6',
    name: 'Ren Asakura',
    email: 'ren.asakura@placement.jp',
    cgpa: 7.8,
    skills: ['Android', 'Kotlin', 'Firebase']
  },
  {
    id: '7',
    name: 'Yuki Hayabusa',
    email: 'yuki.hayabusa@placement.jp',
    cgpa: 9.3,
    skills: ['Data Science', 'Pandas', 'Spark']
  },
  {
    id: '8',
    name: 'Takumi Shirogane',
    email: 'takumi.shirogane@placement.jp',
    cgpa: 8.4,
    skills: ['DevOps', 'Terraform', 'AWS']
  },
  {
    id: '9',
    name: 'Nao Kanzaki',
    email: 'nao.kanzaki@placement.jp',
    cgpa: 9.1,
    skills: ['iOS', 'Swift', 'SwiftUI']
  },
  {
    id: '10',
    name: 'Izumi Totsuka',
    email: 'izumi.totsuka@placement.jp',
    cgpa: 8.9,
    skills: ['Ruby', 'Cloud Native', 'Kafka']
  }
];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const fetchedJobs = await api.fetchStudents();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleAddJob = async (job: Omit<Job, 'id'>) => {
    try {
      const newJob = await api.addStudent(job);
      setJobs([newJob, ...jobs]);
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add record. Please check the backend connection.');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f1117] text-white' : 'bg-gray-50 text-gray-900'} relative overflow-hidden transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-purple-400/20'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-pink-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 ${isDark ? 'bg-blue-500/20' : 'bg-blue-400/15'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>

        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]'} bg-[size:50px_50px]`}></div>

        {/* Radial Gradient Overlay */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)]'}`}></div>
        <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]' : 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_50%)]'}`}></div>
      </div>

      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20'} backdrop-blur-sm border ${isDark ? 'border-white/20' : 'border-gray-900/20'} transition-all shadow-lg`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={24} className="text-yellow-300" /> : <Moon size={24} className="text-purple-600" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI-powered Job Finder
          </h1>
          <p className="text-gray-400 text-lg">
            Evaluating candidates purely by AI precision.
          </p>
        </div>

        {/* Add Record Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
          >
            <Plus size={20} />
            Add Record
          </button>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isDark={isDark} />
            ))}
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddJob}
        isDark={isDark}
      />
    </div>
  );
}