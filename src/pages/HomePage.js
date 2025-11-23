import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    bookName: '',
    author: '',
    categoryId: ''
  });

  // 加载所有分类
  useEffect(() => {
    loadCategories();
    loadAllBooks();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const loadAllBooks = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          categories (
            id,
            category_name
          ),
          book_stocks (
            stock_count,
            location
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('加载图书失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          categories (
            id,
            category_name
          ),
          book_stocks (
            stock_count,
            location
          )
        `);

      // 书名关键词搜索
      if (searchParams.bookName.trim()) {
        query = query.ilike('book_name', `%${searchParams.bookName.trim()}%`);
      }

      // 作者搜索
      if (searchParams.author.trim()) {
        query = query.ilike('author', `%${searchParams.author.trim()}%`);
      }

      // 分类筛选
      if (searchParams.categoryId) {
        query = query.eq('category_id', searchParams.categoryId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1 className="title">图书快查</h1>
        <p className="subtitle">极简图书信息查询平台</p>
      </header>

      <div className="search-section">
        <div className="search-form">
          <div className="search-field">
            <label>书名关键词</label>
            <input
              type="text"
              name="bookName"
              value={searchParams.bookName}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入书名关键词"
            />
          </div>
          <div className="search-field">
            <label>作者</label>
            <input
              type="text"
              name="author"
              value={searchParams.author}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="输入作者姓名"
            />
          </div>
          <div className="search-field">
            <label>分类</label>
            <select
              name="categoryId"
              value={searchParams.categoryId}
              onChange={handleInputChange}
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <button className="search-btn" onClick={handleSearch} disabled={loading}>
            {loading ? '查询中...' : '查询'}
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="category-nav">
          <div className="category-nav-scroll">
            {categories.map(cat => (
              <button
                key={cat.id}
                className="category-tag"
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="books-section">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : books.length === 0 ? (
          <div className="no-results">
            <p>暂无匹配的图书</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <Link key={book.id} to={`/books/${book.id}`} className="book-card">
                <div className="book-cover">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.book_name} />
                  ) : (
                    <div className="book-cover-placeholder">
                      <span>📚</span>
                    </div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.book_name}</h3>
                  <p className="book-author">作者：{book.author}</p>
                  {book.categories && (
                    <p className="book-category">
                      分类：{book.categories.category_name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 图书快查 - 极简图书信息查询平台</p>
      </footer>
    </div>
  );
}

export default HomePage;

