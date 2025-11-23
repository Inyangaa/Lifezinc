import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Target, CheckCircle, Circle, Trash2, Edit2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GoalsPageProps {
  onBack: () => void;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_date: string | null;
  is_completed: boolean;
  milestones: string[];
  completed_milestones: number[];
  created_at: string;
}

export function GoalsPage({ onBack }: GoalsPageProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    target_date: '',
    milestones: [''],
  });

  useEffect(() => {
    if (user?.id) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setGoals(data || []);
  };

  const handleAddGoal = async () => {
    if (!user?.id || !newGoal.title) return;

    const milestones = newGoal.milestones.filter(m => m.trim());

    const { error } = await supabase
      .from('user_goals')
      .insert({
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        target_date: newGoal.target_date || null,
        milestones,
        completed_milestones: [],
        is_completed: false,
      });

    if (!error) {
      setShowAddForm(false);
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        target_date: '',
        milestones: [''],
      });
      loadGoals();
    }
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal) return;

    const { error } = await supabase
      .from('user_goals')
      .update({
        title: editingGoal.title,
        description: editingGoal.description,
        category: editingGoal.category,
        target_date: editingGoal.target_date,
        milestones: editingGoal.milestones,
      })
      .eq('id', editingGoal.id);

    if (!error) {
      setEditingGoal(null);
      loadGoals();
    }
  };

  const toggleMilestone = async (goalId: string, milestoneIndex: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const completedMilestones = [...(goal.completed_milestones || [])];
    const idx = completedMilestones.indexOf(milestoneIndex);

    if (idx > -1) {
      completedMilestones.splice(idx, 1);
    } else {
      completedMilestones.push(milestoneIndex);
    }

    const isCompleted = completedMilestones.length === goal.milestones.length;

    await supabase
      .from('user_goals')
      .update({
        completed_milestones: completedMilestones,
        is_completed: isCompleted
      })
      .eq('id', goalId);

    loadGoals();
  };

  const toggleGoalComplete = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    await supabase
      .from('user_goals')
      .update({ is_completed: !goal.is_completed })
      .eq('id', goalId);

    loadGoals();
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId);

    loadGoals();
  };

  const addMilestone = () => {
    setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, ''] });
  };

  const updateMilestone = (index: number, value: string) => {
    const milestones = [...newGoal.milestones];
    milestones[index] = value;
    setNewGoal({ ...newGoal, milestones });
  };

  const removeMilestone = (index: number) => {
    const milestones = newGoal.milestones.filter((_, i) => i !== index);
    setNewGoal({ ...newGoal, milestones });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      personal: 'bg-blue-100 text-blue-700',
      health: 'bg-green-100 text-green-700',
      relationships: 'bg-pink-100 text-pink-700',
      career: 'bg-purple-100 text-purple-700',
      financial: 'bg-yellow-100 text-yellow-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Goals</h1>
            <p className="text-gray-600">Set and track your personal wellness goals</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Goal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Practice daily meditation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="personal">Personal Growth</option>
                    <option value="health">Health & Wellness</option>
                    <option value="relationships">Relationships</option>
                    <option value="career">Career</option>
                    <option value="financial">Financial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Milestones</label>
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder={`Milestone ${index + 1}`}
                    />
                    {newGoal.milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addMilestone}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  + Add Milestone
                </button>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`bg-white rounded-2xl shadow-md p-6 transition-all ${
                goal.is_completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleGoalComplete(goal.id)}
                    className="mt-1"
                  >
                    {goal.is_completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${goal.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      {goal.target_date && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {goal.milestones && goal.milestones.length > 0 && (
                <div className="mt-4 pl-9 space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Milestones:</p>
                  {goal.milestones.map((milestone, index) => {
                    const isCompleted = goal.completed_milestones?.includes(index);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleMilestone(goal.id, index)}
                          className="flex items-center gap-2 text-left hover:bg-gray-50 rounded px-2 py-1 transition-colors flex-1"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {milestone}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-emerald-600">
                        {goal.completed_milestones?.length || 0} / {goal.milestones.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${((goal.completed_milestones?.length || 0) / goal.milestones.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {goals.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-600 mb-4">Set your first wellness goal to get started</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
