import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './CategoryPage.css';

function CategoryPage() {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryBooks = async () => {
      setLoading(true);
      try {
        // 加载分类信息
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // 加载该分类下的图书
        const { data: booksData, error: booksError } = await supabase
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
          .eq('category_id', id)
          .order('created_at', { ascending: false });

        if (booksError) throw booksError;
        setBooks(booksData || []);
      } catch (error) {
        console.error('加载分类图书失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryBooks();
  }, [id]);

  return (
    <div className="category-page">
      <div className="category-container">
        <Link to="/" className="back-btn">← 返回首页</Link>

        <div className="category-header">
          <h1 className="category-title">
            {category ? `${category.category_name}类图书` : '分类图书'}
          </h1>
        </div>

        <div className="books-section">
          {loading ? (
            <div className="loading">加载中...</div>
          ) : books.length === 0 ? (
            <div className="no-results">
              <p>该分类下暂无图书</p>
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
      </div>
    </div>
  );
}

export default CategoryPage;

