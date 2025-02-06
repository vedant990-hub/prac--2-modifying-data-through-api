 // Import necessary packages
 const express = require('express');
 const mongoose = require('mongoose');
 require('dotenv').config()
 // Initialize Express app
 const app = express();
 const port = process.env.PORT || 3000;
 
 // Middleware
 
 // MongoDB Atlas Connection
app.use(express.json());
 mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected successfully'))
   .catch(err => console.error('MongoDB connection error:', err));
 
 // Define MenuItem Schema
 const menuItemSchema = new mongoose.Schema({
   name: {
     type: String,
     required: [true, 'Name is required']
   },
   description: {
     type: String
   },
   price: {
     type: Number,
     required: [true, 'Price is required']
   }
 });
 
 const MenuItem = mongoose.model('MenuItem', menuItemSchema);
 
 // Routes
 
 // POST /menu - Add new menu item
 app.post('/menu', async (req, res) => {
   const { name, description, price } = req.body;
 
   // Validate input
   if (!name || !price) {
     return res.status(400).json({ error: 'Name and Price are required fields.' });
   }
 
   try {
     const newItem = new MenuItem({ name, description, price });
     await newItem.save();
     res.status(201).json({ message: 'Menu item created successfully', item: newItem });
   } catch (err) {
     res.status(500).json({ error: 'Failed to create menu item', details: err.message });
   }
 });
 
 // GET /menu - Retrieve all menu items
 app.get('/menu', async (req, res) => {
   try {
     const menuItems = await MenuItem.find();
     res.status(200).json(menuItems);
   } catch (err) {
     res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
   }
 });
 
 // PUT /menu/:id - Update existing menu item
 app.put('/menu/:id', async (req, res) => {
   const { id } = req.params;
   const { name, description, price } = req.body;
 
   // Validate input
   if (!name && !description && !price) {
     return res.status(400).json({ error: 'At least one field (name, description, price) must be provided for update.' });
   }
 
   try {
     const updatedItem = await MenuItem.findByIdAndUpdate(
       id,
       { name, description, price },
       { new: true, runValidators: true }
     );
 
     if (!updatedItem) {
       return res.status(404).json({ error: 'Menu item not found.' });
     }
 
     res.status(200).json({ message: 'Menu item updated successfully', item: updatedItem });
   } catch (err) {
     res.status(500).json({ error: 'Failed to update menu item', details: err.message });
   }
 });
 
 // DELETE /menu/:id - Delete menu item
 app.delete('/menu/:id', async (req, res) => {
   const { id } = req.params;
 
   try {
     const deletedItem = await MenuItem.findByIdAndDelete(id);
 
     if (!deletedItem) {
       return res.status(404).json({ error: 'Menu item not found.' });
     }
 
     res.status(200).json({ message: 'Menu item deleted successfully' });
   } catch (err) {
     res.status(500).json({ error: 'Failed to delete menu item', details: err.message });
   }
 });
 
 // Start server
 app.listen(port, () => {
   console.log(`Server is running on port http://localhost:${port}`);
 });
 