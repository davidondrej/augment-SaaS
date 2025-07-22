import React from 'react';
import './FormPane.css';

const FormPane = ({ schema, loading }) => {
  if (loading) {
    return (
      <div className="form-pane">
        <div className="form-loading">
          <div className="loading-spinner"></div>
          <p>Generating form...</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="form-pane">
        <div className="form-placeholder">
          <h2>Form Preview</h2>
          <p>Start a conversation in the chat to create your form. I can help you build:</p>
          <ul>
            <li>Contact forms</li>
            <li>Registration forms</li>
            <li>Survey forms</li>
            <li>Feedback forms</li>
            <li>And much more!</li>
          </ul>
          <p>Just describe what you need and I'll generate a live form for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-pane">
      <div className="form-container">
        <h2 className="form-title">{schema.title || 'Generated Form'}</h2>
        <form className="dynamic-form">
          {schema.fields && schema.fields.map((field, index) => (
            <div key={field.id || index} className="form-field">
              <label htmlFor={field.id} className="field-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="field-input textarea"
                  rows="4"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  className="field-input select"
                >
                  <option value="">Choose an option...</option>
                  {field.options && field.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="field-input"
                />
              )}
            </div>
          ))}
          
          <button type="submit" className="form-submit">
            Submit Form
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPane;
