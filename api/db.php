<?php
// CORS Headers - Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle Preflight Request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'social_ads_db'; // আপনার ডাটাবেজ নাম এখানে দিন
$user = 'root';          // আপনার ইউজারনেম এখানে দিন
$pass = '';              // আপনার পাসওয়ার্ড এখানে দিন
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Return JSON error instead of silent fail
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB Connection Failed: " . $e->getMessage()]);
    exit;
}
?>