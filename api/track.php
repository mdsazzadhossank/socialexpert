<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $eventName = $data['event_name'] ?? 'Unknown';
    $eventData = isset($data['event_data']) ? json_encode($data['event_data']) : '';

    try {
        $stmt = $pdo->prepare("INSERT INTO analytics_logs (event_name, event_data) VALUES (:name, :data)");
        $stmt->execute(['name' => $eventName, 'data' => $eventData]);
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error"]);
    }
}
?>