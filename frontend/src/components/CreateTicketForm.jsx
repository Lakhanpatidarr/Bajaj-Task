import React, { useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';

const CreateTicketForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'low',
  });
  
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Enter a valid email address';
      }
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const success = await onSubmit(formData);
    if (success) {
      // Clear form on success
      setFormData({
        subject: '',
        description: '',
        customerEmail: '',
        priority: 'low',
      });
      setErrors({});
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <BiPlusCircle className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-gray-800">Create New Ticket</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            className={`w-full text-sm bg-gray-50 border ${
              errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } rounded-lg px-3 py-2 outline-none transition-all duration-200`}
            disabled={loading}
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="customerEmail" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Customer Email
          </label>
          <input
            type="text"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="customer@example.com"
            className={`w-full text-sm bg-gray-50 border ${
              errors.customerEmail ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } rounded-lg px-3 py-2 outline-none transition-all duration-200`}
            disabled={loading}
          />
          {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
        </div>

        {/* Priority Dropdown */}
        <div>
          <label htmlFor="priority" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`w-full text-sm bg-gray-50 border ${
              errors.priority ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } rounded-lg px-3 py-2 outline-none transition-all duration-200 text-gray-700 font-medium`}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Detailed description of the problem..."
            className={`w-full text-sm bg-gray-50 border ${
              errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } rounded-lg px-3 py-2 outline-none transition-all duration-200`}
            disabled={loading}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Creating...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketForm;
