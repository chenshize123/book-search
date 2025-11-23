import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import './BookDetailPage.css';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookDetail();
  }, [id]);

  const loadBookDetail = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
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
        .eq('id', id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('加载图书详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="detail-page">
        <div className="no-results">
          <p>未找到该图书</p>
          <Link to="/" className="back-btn">返回首页</Link>
        </div>
      </div>
    );
  }

  const stock = book.book_stocks && book.book_stocks[0];

  return (
    <div className="detail-page">
      <div className="detail-container">
        <Link to="/" className="back-btn">← 返回列表</Link>

        <div className="book-detail-card">
          <div className="detail-cover">
            {book.cover_image_url ? (
              <img src={book.cover_image_url} alt={book.book_name} />
            ) : (
              <div className="detail-cover-placeholder">
                <span>📚</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{book.book_name}</h1>
            
            <div className="detail-item">
              <span className="detail-label">作者：</span>
              <span className="detail-value">{book.author}</span>
            </div>

            {book.categories && (
              <div className="detail-item">
                <span className="detail-label">分类：</span>
                <span className="detail-value">{book.categories.category_name}</span>
              </div>
            )}

            {book.publisher && (
              <div className="detail-item">
                <span className="detail-label">出版社：</span>
                <span className="detail-value">{book.publisher}</span>
              </div>
            )}

            {book.publish_date && (
              <div className="detail-item">
                <span className="detail-label">出版日期：</span>
                <span className="detail-value">
                  {new Date(book.publish_date).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}

            {book.isbn && (
              <div className="detail-item">
                <span className="detail-label">ISBN：</span>
                <span className="detail-value">{book.isbn}</span>
              </div>
            )}

            {stock && (
              <>
                <div className="detail-item">
                  <span className="detail-label">库存数量：</span>
                  <span className="detail-value">{stock.stock_count || 0}</span>
                </div>
                {stock.location && (
                  <div className="detail-item">
                    <span className="detail-label">存放位置：</span>
                    <span className="detail-value">{stock.location}</span>
                  </div>
                )}
              </>
            )}

            {book.intro && (
              <div className="detail-intro">
                <h3 className="intro-title">图书简介</h3>
                <p className="intro-content">{book.intro}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;

