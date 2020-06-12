import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

// Set up express
const app = express()


// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

// Get all the albums
app.get('/api/v1/albums', (req, res) => {

    // If the endpoint is reached
    res.status(200).send({
        success: 'true',
        message: 'Albums retrieved successfully',
        // Pull the array from the database
        albums: db,
    })
})

const PORT = 5000;
// This will change once hosted


// Create/make sure the server is up and running
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


// Endpoint to create a new album; we want complete album info so handle errors
// POST
app.post('/api/v1/albums', (req, res) => {

    if (!req.body.title) {
        // if there's no album title throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Title is required.'
        })
    } else if (!req.body.tracks) {
        // if the tracks aren't correct throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Track is required.'
        })
    } else if (!req.body.length) {
        // if there's no length throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Length is required.'
        })

    } else if (!req.body.year) {
        // if there's no year throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Year is required.'
        })

    } else if (!req.body.singles) {
        // if there's no singles throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Single is required.'
        })
    } else if (!req.body.img) {
        // if there's no image url throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Image url is required.'
        })
    }


    // For each album
    const album = {
        id: db.length + 1,
        title: req.body.title,
        tracks: req.body.tracks,
        length: req.body.length,
        singles: req.body.singles,
        year: req.body.year,
        img: req.body.img,
    }

    db.push(album)

    // 201 messages tell us something has been created
    return res.status(201).send({
        success: 'true',
        message: 'Album added successfully',
        album
    })
})
// req refers to the req parameter
// req.body is the syntax from bodyParser




// Endpoint to get a single album
// GET
app.get('/api/v1/albums/:id', (req, res) => {

    const id = parseInt(req.params.id, 10)
    // object containing properties mapped to the named route “parameters”
    // so it'll grab whichever property route we want from our endpoint
    // to get a single todo we’ll need a unique way to identify this todo in the database

    db.map((album) => {

        if (album.id === id) {

            return res.status(200).send({

                success: 'true',
                message: 'Album retrieved successfully.',
                album,
            })
        }

    })

    return res.status(404).send({

        success: 'false',
        message: 'Album does not exist.'
    })
})
// there are times we want to pass parameters to our endpoints because we will need them in our application, to pass those parameters we use :param




// This allows us to delete albums from the database in case we need to update it
// DELETE Endpoint
app.delete('/api/v1/albums/:id', (req, res) => {

    const id = parseInt(req.params.id, 10)

    db.map((album, index) => {

        if (album.id === id) {
            // if the route's id matches the id we want to delete splice that one index out of the database array
            db.splice(index, 1)

            return res.status(200).send({

                success: 'true',
                message: 'Album deleted successfully.'
            })
        }
    })

    return res.status(404).send({

        success: 'false',
        message: 'Album not found.'
    })
})



// PUT Endpoint
// updates the database
app.put('/api/v1/albums/:id', (req, res) => {

    const id = parseInt(req.params.id, 10)

    let albumFound
    let itemIndex

    db.map((album, index) => {

        if(album.id === id) {

            albumFound = album
            itemIndex = index
        }
    })

    if (!albumFound) {

        return res.status(404).send({

            success: 'false',
            message: 'Album not found.'
        })
    }

    if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'Title is required.'
        })

    }  else if (!req.body.tracks) {
        // if the tracks aren't correct throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Track is required.'
        })

    } else if (!req.body.length) {
        // if there's no length throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Length is required.'
        })

    } else if (!req.body.year) {
        // if there's no year throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Year is required.'
        })

    } else if (!req.body.singles) {
        // if there's no singles throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Single is required.'
        })

    } else if (!req.body.img) {
        // if there's no image url throw an error
        return res.status(400).send({
            success: 'false',
            message: 'Image url is required.'
        })
    }

    const updatedAlbum = {

        id: albumFound.id,
        title: req.body.title || albumFound.title,
        tracks: req.body.tracks || albumFound.tracks,
        length: req.body.length || albumFound.length,
        singles: req.body.singles || albumFound.singles,
        year: req.body.year || albumFound.year,
        img: req.body.img || albumFound.img,
    }

    db.splice(itemIndex, 1, updatedAlbum)
    // take out the older version of the album and replace it

    return res.status(201).send({

        success: 'true',
        message: 'Album added successfully.',
        updatedAlbum,
    })

})









// 404 indicates the resource can’t be found.
// 400 indicates the request was bad, where “bad” means that it was malformed in some way.
// 200 OK success status response code indicates that the request has succeeded
// 201 the request has been fulfilled and has resulted in one or more new resources being created.