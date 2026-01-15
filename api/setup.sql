
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT
);

CREATE TABLE IF NOT EXISTS analytics_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100),
    event_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Values
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
('hero_id', '1'),
('video_urls', '{"hero": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "solution": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "testimonial": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "qualifying": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "metaAds": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "ecommerce": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "businessSetup": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "landingPage": "https://new.socialadsexpert.com/image/Final%20Video.mp4", "fakeOrder": "https://new.socialadsexpert.com/image/Final%20Video.mp4"}'),
('demo_links', '["#", "#", "#", "#", "#", "#"]'),
('lp_demo_links', '["#", "#", "#", "#", "#"]'),
('tracking_config', '{"pixelId": "2072676449899461", "accessToken": "", "testEventCode": ""}');
