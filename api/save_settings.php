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
        // Fix: Use unique placeholders for INSERT and UPDATE values
        $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE setting_value = :value_update");
        
        foreach ($data as $key => $value) {
            // Encode array/objects to string, keep strings as is
            $jsonValue = is_array($value) || is_object($value) ? json_encode($value) : $value;
            
            // Pass the value twice, once for :value and once for :value_update
            $stmt->execute([
                'key' => $key, 
                'value' => $jsonValue,
                'value_update' => $jsonValue
            ]);
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