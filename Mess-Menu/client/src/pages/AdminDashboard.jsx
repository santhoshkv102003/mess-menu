import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('food');
    const [foodItems, setFoodItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'Breakfast', dietType: 'Veg', image: '' });
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const res = await api.get('/admin/food-items');
            setFoodItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/food-item', newItem);
            setNewItem({ name: '', category: 'Breakfast', dietType: 'Veg', image: '' });
            fetchFoodItems();
            alert('Item added!');
        } catch (err) {
            alert('Error adding item');
        }
    };

    const handleGenerateMonthly = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM
            const res = await api.get(`/admin/generate-monthly?month=${month}`);
            setMenuData(res.data);
        } catch (err) {
            alert('Error generating menu');
        }
    };

    const handleLockMenu = async () => {
        if (!menuData || !menuData.suggestedItems) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            const itemIds = menuData.suggestedItems.map(i => i._id);
            await api.post('/admin/menu', { month, items: itemIds });
            alert('Menu Locked Successfully!');
        } catch (err) {
            alert('Error locking menu');
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h2>Admin Dashboard - Welcome {user.name}</h2>
                <button onClick={logout} className="btn-primary" style={{ width: 'auto' }}>Logout</button>
            </div>

            <div className="container">
                <div className="nav-tabs">
                    <button className={`nav-btn ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>Manage Food</button>
                    <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu Generation</button>
                </div>

                {activeTab === 'food' && (
                    <div>
                        <div className="card">
                            <h3>Add Food Item</h3>
                            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Food Name"
                                    className="form-input"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    required
                                />
                                <select
                                    className="form-input"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Snack</option>
                                    <option>Dinner</option>
                                </select>
                                <select
                                    className="form-input"
                                    value={newItem.dietType}
                                    onChange={e => setNewItem({ ...newItem, dietType: e.target.value })}
                                    style={{ width: '120px' }}
                                >
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Image URL (optional)"
                                    className="form-input"
                                    value={newItem.image || ''}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn-primary" style={{ width: '150px' }}>Add Item</button>
                            </form>
                        </div>

                        <div className="card">
                            <h3>Food Items ({foodItems.length})</h3>
                            <div className="food-grid">
                                {foodItems.map(item => (
                                    <div key={item._id} className="food-card" style={{
                                        backgroundImage: item.image ? `url(${item.image})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        color: item.image ? 'white' : 'inherit',
                                        padding: item.image ? 0 : '1.5rem'
                                    }}>
                                        <div style={item.image ? {
                                            background: 'rgba(0,0,0,0.6)',
                                            height: '100%',
                                            width: '100%',
                                            padding: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        } : {}}>
                                            <strong style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="card">
                        <h3>Monthly Menu Generation</h3>
                        <p>Generate menu for current month based on student votes.</p>
                        <button onClick={handleGenerateMonthly} className="btn-primary" style={{ width: '200px', marginBottom: '1rem' }}>Generate Suggestion</button>

                        {menuData && (
                            <div>
                                <h4>Suggested Weekly Menu</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>Day</th>
                                            <th style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>Breakfast</th>
                                            <th style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>Lunch</th>
                                            <th style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>Snack</th>
                                            <th style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>Dinner</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuData.weekMenu && menuData.weekMenu.map((day, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid var(--glass-border)', padding: '0.8rem', fontWeight: 'bold' }}>{day.day}</td>
                                                <td style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>{day.breakfast ? `${day.breakfast.name} (${menuData.counts[day.breakfast._id]} votes)` : '-'}</td>
                                                <td style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>{day.lunch ? `${day.lunch.name} (${menuData.counts[day.lunch._id]} votes)` : '-'}</td>
                                                <td style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>{day.snack ? `${day.snack.name} (${menuData.counts[day.snack._id]} votes)` : '-'}</td>
                                                <td style={{ border: '1px solid var(--glass-border)', padding: '0.8rem' }}>{day.dinner ? `${day.dinner.name} (${menuData.counts[day.dinner._id]} votes)` : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button onClick={handleLockMenu} className="btn-primary" style={{ width: '200px', marginTop: '1rem', backgroundColor: '#28a745' }}>Lock This Menu</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
