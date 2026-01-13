import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const StudentDashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('vote');
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [menu, setMenu] = useState(null);

    // For feedback/replacement
    const [dislikedItems, setDislikedItems] = useState([]);
    const [replacementItems, setReplacementItems] = useState([]);

    useEffect(() => {
        fetchFoodItems();
        fetchMenu();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const res = await api.get('/admin/food-items'); // Assuming students can view this
            setFoodItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMenu = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7);
            const res = await api.get(`/student/menu?month=${month}`);
            setMenu(res.data);
        } catch (err) {
            console.log('No menu found yet');
        }
    };

    const [activeCategory, setActiveCategory] = useState('Breakfast');

    const toggleSelection = (id, list, setList, max) => {
        if (list.includes(id)) {
            setList(list.filter(i => i !== id));
        } else {
            if (list.length >= max) {
                alert(`You can select only ${max} items`);
                return;
            }
            setList([...list, id]);
        }
    };

    const toggleMonthlySelection = (id, category) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            // Check count for this specific category
            const currentCategorySelection = selectedItems.filter(itemId => {
                const item = foodItems.find(f => f._id === itemId);
                return item && item.category === category;
            });

            if (currentCategorySelection.length >= 7) {
                alert(`You can only select 7 items for ${category}`);
                return;
            }
            setSelectedItems([...selectedItems, id]);
        }
    };

    const submitMonthlyVote = async () => {
        const categories = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
        for (const cat of categories) {
            const count = selectedItems.filter(id => {
                const item = foodItems.find(f => f._id === id);
                return item && item.category === cat;
            }).length;

            if (count !== 7) {
                alert(`Please select exactly 7 items for ${cat} (Current: ${count})`);
                return;
            }
        }

        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/vote-monthly', { month, selectedItems });
            alert('Vote submitted!');
        } catch (err) {
            alert('Error submitting vote');
        }
    };

    const submitFeedback = async () => {
        if (dislikedItems.length === 0) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/feedback', { month, week: 1, dislikedItems }); // Hardcoded week 1 for demo
            alert('Feedback submitted!');
        } catch (err) {
            alert('Error submitting feedback');
        }
    };

    const submitReplacement = async () => {
        if (replacementItems.length === 0) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/vote-replacement', { month, week: 1, replacementItems });
            alert('Replacement vote submitted!');
        } catch (err) {
            alert('Error submitting replacement vote');
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2>Student Dashboard - {user.name}</h2>
                <button onClick={logout} className="btn-primary" style={{ width: 'auto' }}>Logout</button>
            </div>

            <div className="container">
                <div className="nav-tabs">
                    <button className={`nav-btn ${activeTab === 'vote' ? 'active' : ''}`} onClick={() => setActiveTab('vote')}>Monthly Vote</button>
                    <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>View Menu</button>
                    <button className={`nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>Weekly Feedback</button>
                </div>

                {activeTab === 'vote' && (
                    <div className="card">
                        <h3>Vote for Monthly Menu</h3>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Select exactly 7 items from each category. (Total: {selectedItems.length}/28)</p>

                        {/* Category Sub-tabs */}
                        <div className="nav-tabs" style={{ borderBottom: 'none', marginBottom: '1.5rem', gap: '0.5rem' }}>
                            {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(cat => {
                                const count = selectedItems.filter(id => {
                                    const item = foodItems.find(f => f._id === id);
                                    return item && item.category === cat;
                                }).length;
                                const isComplete = count === 7;

                                return (
                                    <button
                                        key={cat}
                                        className={`nav-btn ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            borderColor: isComplete ? 'var(--primary)' : 'transparent',
                                            color: activeCategory === cat ? 'white' : (isComplete ? 'var(--primary)' : 'var(--text-muted)')
                                        }}
                                    >
                                        {cat} {isComplete ? '✓' : `(${count}/7)`}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Category Content */}
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{activeCategory} Menu</h4>
                            <div className="food-grid">
                                {foodItems.filter(item => item.category === activeCategory).map(item => (
                                    <div
                                        key={item._id}
                                        className={`food-card ${selectedItems.includes(item._id) ? 'selected' : ''}`}
                                        onClick={() => toggleMonthlySelection(item._id, item.category)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{item.name}</strong>
                                        <p>{item.category}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={submitMonthlyVote} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Submit Monthly Vote</button>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="card">
                        <h3>Current Menu</h3>
                        {menu ? (
                            <div className="food-grid">
                                {menu.items.map(item => (
                                    <div key={item._id} className="food-card">
                                        <strong>{item.name}</strong>
                                        <p>{item.category}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p>No menu active for this month.</p>}
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="card">
                        <h3>Weekly Feedback - Disliked Items (Max 3)</h3>
                        {menu ? (
                            <div>
                                <div className="food-grid">
                                    {menu.items.map(item => (
                                        <div
                                            key={item._id}
                                            className={`food-card ${dislikedItems.includes(item._id) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection(item._id, dislikedItems, setDislikedItems, 3)}
                                            style={{ cursor: 'pointer', borderColor: dislikedItems.includes(item._id) ? 'red' : '#eee' }}
                                        >
                                            <strong>{item.name}</strong>
                                            <p>{item.category}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={submitFeedback} className="btn-primary" style={{ marginTop: '1rem', background: '#dc3545' }}>Submit Feedback</button>
                            </div>
                        ) : <p>No menu to differentiate.</p>}

                        <h3 style={{ marginTop: '2rem' }}>Vote Replacements (Max 3)</h3>
                        <div className="food-grid">
                            {foodItems.filter(i => menu ? !menu.items.find(m => m._id === i._id) : true).map(item => (
                                <div
                                    key={item._id}
                                    className={`food-card ${replacementItems.includes(item._id) ? 'selected' : ''}`}
                                    onClick={() => toggleSelection(item._id, replacementItems, setReplacementItems, 3)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <strong>{item.name}</strong>
                                    <p>{item.category}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={submitReplacement} className="btn-primary" style={{ marginTop: '1rem', background: '#28a745' }}>Vote Replacement</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
