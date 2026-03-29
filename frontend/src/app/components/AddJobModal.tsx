import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Job } from '../App';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (job: Omit<Job, 'id'>) => void;
  isDark: boolean;
}

export function AddJobModal({ isOpen, onClose, onAdd, isDark }: AddJobModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !cgpa || skills.length === 0) {
      alert('Please fill all fields and add at least one skill');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name,
        email,
        cgpa: parseFloat(cgpa),
        skills
      });

      // Reset form
      setName('');
      setEmail('');
      setCgpa('');
      setSkills([]);
      setSkillInput('');
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-[#1a1d29] border-gray-800' : 'bg-white border-gray-200'} rounded-xl border p-6 max-w-md w-full shadow-2xl`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add New Record
          </h2>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 ${isDark ? 'bg-[#0f1117] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 ${isDark ? 'bg-[#0f1117] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className={`w-full px-4 py-2 ${isDark ? 'bg-[#0f1117] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
              placeholder="Enter CGPA (0-10)"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className={`flex-1 px-4 py-2 ${isDark ? 'bg-[#0f1117] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:border-purple-500 transition-colors`}
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${isDark ? 'bg-purple-900/40 text-purple-300 border-purple-700/50' : 'bg-purple-100 text-purple-700 border-purple-300'} rounded-full text-sm border flex items-center gap-2`}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg font-semibold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 bg-gradient-to-r ${isSubmitting ? 'from-gray-500 to-gray-600 cursor-not-allowed' : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} rounded-lg font-semibold transition-all shadow-lg text-white flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  Adding...
                  <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                'Add Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}