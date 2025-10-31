# TypeScript REST API

Boilerplate for a minimal REST API using **Express 5**, **TypeScript**, and **routing-controllers**.

## Stack

* Express 5
* routing-controllers, class-validator, class-transformer
* helmet, cors, morgan, multer
* BullMQ, Redis/Valkey
* PostgreSQL
* TypeScript, TSX/TSC

## Usage

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm run start
```

## Health/Test Routes

GET `/api/v1/health`  
GET `/api/v1/ping`

# Create a new task
Write-Host "Creating task..." -ForegroundColor Cyan
$body = @{
    title = "Test Task"
    description = "This is a test"
    completed = $false
} | ConvertTo-Json

$createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks" -Method Post -Body $body -ContentType "application/json"
Write-Host "Created: $($createResponse.message)" -ForegroundColor Green

# Wait a moment for the worker to process
Start-Sleep -Seconds 2

# Get all tasks and find the latest one
Write-Host "`nFetching all tasks..." -ForegroundColor Cyan
$allTasks = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks" -Method Get

# Get the last task (newest one)
$latestTask = $allTasks.data | Sort-Object -Property id -Descending | Select-Object -First 1
$taskId = $latestTask.id

Write-Host "Latest task ID: $taskId" -ForegroundColor Yellow
Write-Host "Title: $($latestTask.title)" -ForegroundColor Yellow

# Update the task
Write-Host "`nUpdating task $taskId..." -ForegroundColor Cyan
$updateBody = @{
    title = "Updated Test Task"
    description = "This has been updated"
    completed = $true
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks/$taskId" -Method Put -Body $updateBody -ContentType "application/json"
Write-Host "Updated: $($updateResponse.message)" -ForegroundColor Green

# Wait for worker
Start-Sleep -Seconds 2

# Verify the update
Write-Host "`nVerifying update..." -ForegroundColor Cyan
$verifyTask = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks/$taskId" -Method Get
Write-Host "Task after update:" -ForegroundColor Yellow
Write-Host "  Title: $($verifyTask.data.title)"
Write-Host "  Completed: $($verifyTask.data.completed)"

# Delete the task
Write-Host "`nDeleting task $taskId..." -ForegroundColor Cyan
$deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks/$taskId" -Method Delete
Write-Host "Deleted: $($deleteResponse.message)" -ForegroundColor Green

# Wait for worker
Start-Sleep -Seconds 2

# Verify deletion
Write-Host "`nVerifying deletion..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tasks/$taskId" -Method Get
    Write-Host "ERROR: Task still exists!" -ForegroundColor Red
} catch {
    Write-Host "Task successfully deleted!" -ForegroundColor Green
}
