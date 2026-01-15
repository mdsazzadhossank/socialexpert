<?php
require 'db.php';

// Ensure content type is JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw input
    $inputJSON = file_get_contents('php://input');
    $data = json_decode($inputJSON, true);
    
    // Debug: Check if data is received
    if (empty($data)) {
        echo json_encode([
            "status" => "error", 
            "message" => "No data received or Invalid JSON.",
            "raw_input" => $inputJSON 
        ]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE setting_value = :value");
        
        foreach ($data as $key => $value) {
            // Encode array/objects to string, keep strings as is
            $jsonValue = is_array($value) || is_object($value) ? json_encode($value) : $value;
            $stmt->execute(['key' => $key, 'value' => $jsonValue]);
        }

        echo json_encode(["status" => "success", "message" => "Settings Saved Successfully"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "SQL Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Request Method. Use POST."]);
}
?>