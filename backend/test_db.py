#!/usr/bin/env python3

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    try:
        # Get database URL from environment
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            print("❌ DATABASE_URL not found in environment variables")
            return False
        
        print(f"🔗 Testing connection to: {database_url.split('@')[1]}")
        
        # Create engine
        engine = create_engine(database_url)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text('SELECT 1'))
            print("✅ Successfully connected to Supabase PostgreSQL!")
            
            # Test if we can create tables
            print("🔧 Testing table creation...")
            from server_postgres import Base
            Base.metadata.create_all(bind=engine)
            print("✅ Tables created successfully!")
            
        engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
