<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        echo json_encode(["status" => "error", "message" => "No data provided"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE setting_value = :value");
        
        foreach ($data as $key => $value) {
            $jsonValue = is_array($value) || is_object($value) ? json_encode($value) : $value;
            $stmt->execute(['key' => $key, 'value' => $jsonValue]);
        }

        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>