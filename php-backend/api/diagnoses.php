<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM diagnoses ORDER BY created_at DESC");
        $diagnoses = $stmt->fetchAll();
        echo json_encode([
            "status" => "success",
            "data" => $diagnoses
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['verdict']) || empty($input['photo'])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required diagnosis fields (verdict, photo)."]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO diagnoses (verdict, cf, ex, tip, leaf_health, hydration_score, disease_risk, vata, pitta, kapha, temp, humidity, atmos, photo) 
                               VALUES (:verdict, :cf, :ex, :tip, :leaf_health, :hydration_score, :disease_risk, :vata, :pitta, :kapha, :temp, :humidity, :atmos, :photo)");
        
        $stmt->execute([
            ':verdict' => $input['verdict'],
            ':cf' => (int)$input['cf'],
            ':ex' => $input['ex'],
            ':tip' => $input['tip'],
            ':leaf_health' => (int)$input['scores']['leafHealth'],
            ':hydration_score' => (int)$input['scores']['hydrationScore'],
            ':disease_risk' => (int)$input['scores']['diseaseRisk'],
            ':vata' => (int)$input['dosha']['vata'],
            ':pitta' => (int)$input['dosha']['pitta'],
            ':kapha' => (int)$input['dosha']['kapha'],
            ':temp' => (float)$input['weather']['t'],
            ':humidity' => (float)$input['weather']['h'],
            ':atmos' => $input['weather']['c'],
            ':photo' => $input['photo']
        ]);
        
        echo json_encode([
            "status" => "success",
            "message" => "Diagnosis saved successfully in database.",
            "data" => $input
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
