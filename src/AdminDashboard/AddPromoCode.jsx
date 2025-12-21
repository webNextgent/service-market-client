import { useState, useEffect } from 'react';
import { Tag, Calendar, X, ArrowRight, Sparkles, CheckCircle, Clock, Plus, Trash2, Edit2, Copy, Percent } from 'lucide-react';

const AddPromoCode = () => {
    const [promoCode, setPromoCode] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [discount, setDiscount] = useState('');
    const [promoCodes, setPromoCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ code: '', expiryDate: '', discount: '' });

    // Load existing promo codes from server
    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://job-task-nu.vercel.app/api/v1/promo-code');
            const data = await response.json();
            if (data.success) {
                setPromoCodes(data.data || []);
            }
        } catch (err) {
            setError('Failed to load promo codes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!promoCode.trim()) {
            setError('Please enter a promo code');
            return;
        }

        if (!discount || isNaN(discount) || parseFloat(discount) <= 0) {
            setError('Please enter a valid discount amount');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const promoData = {
            code: promoCode.trim(),
            expiryDate: expiryDate || null,
            discount: parseFloat(discount)
        };

        try {
            const response = await fetch('https://job-task-nu.vercel.app/api/v1/promo-code/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promoData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('✅ Promo code added successfully!');
                setPromoCode('');
                setExpiryDate('');
                setDiscount('');
                fetchPromoCodes(); // Refresh list
                
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to add promo code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this promo code?')) {
            return;
        }

        try {
            const response = await fetch(`https://job-task-nu.vercel.app/api/v1/promo-code/delete/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                setPromoCodes(promoCodes.filter(code => code._id !== id));
                setSuccess('🗑️ Promo code deleted successfully');
                
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError('Failed to delete promo code');
        }
    };

    const handleEdit = (promo) => {
        setEditingId(promo._id);
        setEditData({
            code: promo.code,
            expiryDate: promo.expiryDate || '',
            discount: promo.discount.toString()
        });
    };

    const handleUpdate = async () => {
        if (!editData.code.trim()) {
            setError('Please enter a promo code');
            return;
        }

        if (!editData.discount || isNaN(editData.discount) || parseFloat(editData.discount) <= 0) {
            setError('Please enter a valid discount amount');
            return;
        }

        try {
            const response = await fetch(`https://job-task-nu.vercel.app/api/v1/promo-code/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: editData.code,
                    expiryDate: editData.expiryDate || null,
                    discount: parseFloat(editData.discount)
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess('✏️ Promo code updated successfully!');
                setEditingId(null);
                fetchPromoCodes(); // Refresh list
                
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to update promo code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSuccess('📋 Copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No expiry';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ code: '', expiryDate: '', discount: '' });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-2.5 rounded-full mb-4 shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">Promotion Management</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Promo Code Dashboard
                </h1>
                <p className="text-gray-600 max-w-lg mx-auto text-lg">
                    Create, manage, and track all your promotional codes in one place
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Add/Edit Promo Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                            {editingId ? (
                                <Edit2 className="w-6 h-6 text-white" />
                            ) : (
                                <Plus className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit Promo Code' : 'Create New Promo'}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {editingId ? 'Update your existing promo code' : 'Add a new promotional code with discount'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* Promo Code Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                                    <Tag className="w-4 h-4" />
                                    Promo Code
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editingId ? editData.code : promoCode}
                                        onChange={(e) => {
                                            const value = e.target.value.toUpperCase();
                                            if (editingId) {
                                                setEditData({ ...editData, code: value });
                                            } else {
                                                setPromoCode(value);
                                            }
                                            setError('');
                                        }}
                                        placeholder="SUMMER25, WINTER30, etc."
                                        className="w-full px-5 py-4 pl-12 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
                                        maxLength={20}
                                        required
                                    />
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        {editingId ? editData.code.length : promoCode.length}/20
                                    </div>
                                </div>
                            </div>

                            {/* Discount Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                                    <Percent className="w-4 h-4" />
                                    Discount Amount ($)
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="1000"
                                        value={editingId ? editData.discount : discount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (editingId) {
                                                setEditData({ ...editData, discount: value });
                                            } else {
                                                setDiscount(value);
                                            }
                                            setError('');
                                        }}
                                        placeholder="10.50"
                                        className="w-full px-5 py-4 pl-12 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
                                        required
                                    />
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                        USD
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 ml-1">
                                    Enter discount amount in dollars (e.g., 10.50 for $10.50 off)
                                </p>
                            </div>

                            {/* Expiry Date Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    Expiry Date (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={editingId ? editData.expiryDate : expiryDate}
                                        onChange={(e) => {
                                            if (editingId) {
                                                setEditData({ ...editData, expiryDate: e.target.value });
                                            } else {
                                                setExpiryDate(e.target.value);
                                            }
                                        }}
                                        className="w-full px-5 py-4 pl-12 bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-none transition-all [color-scheme:light]"
                                    />
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>
                                <p className="text-sm text-gray-500 mt-2 ml-1">
                                    Leave empty for codes that never expire
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <X className="w-5 h-5 text-red-500" />
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <p className="text-green-700 font-medium">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting || (editingId ? !editData.code.trim() || !editData.discount : !promoCode.trim() || !discount)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 group shadow-md hover:shadow-lg"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </div>
                                ) : editingId ? (
                                    <>
                                        <Edit2 className="w-5 h-5" />
                                        Update Promo Code
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Add Promo Code
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Promo Codes List */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">All Promo Codes</h2>
                                <p className="text-gray-500 mt-1">Manage your existing promotional codes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                {promoCodes.length} total
                            </span>
                            <button
                                onClick={fetchPromoCodes}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <ArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-700 font-medium">Loading promo codes...</p>
                            <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
                        </div>
                    ) : promoCodes.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                                <Tag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No promo codes yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                Create your first promotional code to get started with discounts and offers
                            </p>
                            <button
                                onClick={() => document.getElementById('promo-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Code
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                                {promoCodes.map((promo) => (
                                    <div
                                        key={promo._id}
                                        className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                                            isExpired(promo.expiryDate)
                                                ? 'bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-gray-300'
                                                : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-200'
                                        } ${editingId === promo._id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`p-3 rounded-lg ${
                                                    isExpired(promo.expiryDate) 
                                                        ? 'bg-gray-200' 
                                                        : 'bg-gradient-to-br from-blue-100 to-blue-200'
                                                }`}>
                                                    <Tag className={`w-5 h-5 ${
                                                        isExpired(promo.expiryDate)
                                                            ? 'text-gray-600'
                                                            : 'text-blue-700'
                                                    }`} />
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="text-xl font-bold text-gray-900">
                                                            {promo.code}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {!isExpired(promo.expiryDate) ? (
                                                                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                                                                    🟢 ACTIVE
                                                                </span>
                                                            ) : (
                                                                <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 text-xs font-semibold rounded-full border border-red-200">
                                                                    🔴 EXPIRED
                                                                </span>
                                                            )}
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                                Used: {promo.usageCount || 0} times
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Percent className="w-4 h-4 text-blue-500" />
                                                            <span className="text-lg font-bold text-blue-700">
                                                                ${parseFloat(promo.discount).toFixed(2)} off
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className={`text-sm font-medium ${
                                                                isExpired(promo.expiryDate)
                                                                    ? 'text-red-600'
                                                                    : 'text-gray-700'
                                                            }`}>
                                                                {promo.expiryDate ? `Expires: ${formatDate(promo.expiryDate)}` : 'Never expires'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            Created: {formatDate(promo.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleCopyCode(promo.code)}
                                                    className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors group"
                                                    title="Copy code"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(promo)}
                                                    className="p-2.5 hover:bg-green-50 rounded-lg transition-colors group"
                                                    title="Edit code"
                                                >
                                                    <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promo._id)}
                                                    className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                                                    title="Delete code"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">Total Codes</p>
                                        <p className="text-3xl font-bold text-blue-900 mt-1">{promoCodes.length}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                        <p className="text-sm font-medium text-green-800">Active</p>
                                        <p className="text-3xl font-bold text-green-900 mt-1">
                                            {promoCodes.filter(p => !isExpired(p.expiryDate)).length}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                        <p className="text-sm font-medium text-purple-800">Total Discount</p>
                                        <p className="text-3xl font-bold text-purple-900 mt-1">
                                            ${promoCodes.reduce((sum, promo) => sum + parseFloat(promo.discount), 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS for custom scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default AddPromoCode;