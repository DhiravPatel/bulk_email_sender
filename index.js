const express = require('express')
const cors = require('cors')
const app = express()
const {sendBulkEmails} = require('./controller/BulkMailController')

const PORT = process.env.PORT || 4242

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.post('/api/send_bulk_mail', sendBulkEmails)

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Bulk Email Sender API is running' 
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})