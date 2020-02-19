
////////////////////////////////////////////////////////////////////////
// Image Upload
////////////////////////////////////////////////////////////////////////
// This code will take care of the handling of when user uploads picture
// or provides URL for the picture

// Note, this is the start of all indexing for all canvas
var count = 0;

// If you want canvas to exist, add in these commented-out items
// var canvas = document.createElement('canvas');
// // Add count class to canvas (used later for download and delete)
// canvas.classList.add("canvas");
// canvas.setAttribute("id", `count-${count}`);


var memePanel = document.getElementById('meme-panel');
// imageCanvas.appendChild(canvas);
// canvas.width = 500;
// canvas.height = 500;
// var ctx = canvas.getContext('2d');
var img = document.createElement('img');


// var imageLoader = document.getElementById('imageLoader');
// imageLoader.addEventListener('change', handleImage, false);

document.getElementById('imageLoader').onchange = function (ev) {
    var reader = new FileReader();
    reader.onload = function (ev) {
        img.src = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);

    // This is tricky. In order to have the same picture be uploaded consecutively, 
    // I need this next line of code to "reset the input field's value". If I don't have
    // this line, the 2nd consecutive image upload file input has not changed from the 
    // previous upload and therefore the onchange function isn't even called. 
    this.value = '';
};

// If image is uploaded through the URL input
document.getElementById('imgURL').oninput = function (ev) {
    img.src = this.value;
};

img.onload = function (ev) {
    // Let's get rid of the old picture (if user has not created a meme, and it's still there)
    oldMemebox = document.getElementById(`count-${count}`);
    if (!(oldMemebox === null)) {
        // If there is an existing canvas, we want to delete that canvas
        console.log("Delete unwanted picture");
        document.getElementById(`count-${count}`).remove();
    }

    // Create the memeBox, which will hold the meme image (canvas) and the checkbox
    memeBox = document.createElement('div');
    memeBox.classList.add("memeBox");
    // Add ID attribute (used later for download and delete)
    memeBox.setAttribute("id", `count-${count}`);

    // Create new canvas for the image to go in
    canvas = document.createElement('canvas');
    // Add count class to canvas 
    canvas.classList.add("canvas");
    canvas.setAttribute("id", `canvas-${count}`);

    // Append new canvas to the memeBox, and the memeBox to memePanel
    memePanel.appendChild(memeBox);
    memeBox.appendChild(canvas);

    // Draw
    ctx = canvas.getContext('2d');
    draw();
};

////////////////////////////////////////////////////////////////////////
// Meme Upload Button (Uploading Meme)
////////////////////////////////////////////////////////////////////////
// Event Listener for Meme Upload button

document.getElementById('memeLoader').onclick = function (ev) {
    // Check to see if there is a memeBox to upload
    memeToUpload = document.getElementById(`count-${count}`);

    if (!(memeToUpload === null)) {
        // Means that button was clicked and there is a picture on canvas
        console.log(memeToUpload);

        // Let's create the checkbox (to control delete/download)
        var checkBox = document.createElement("INPUT");
        // checkBox.innerHTML = "Remove"; // Use this for buttons
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "checkbox");
        checkBox.setAttribute("id", `checkbox-${count}`);

        // Add event listener for each checkbox
        checkBox.addEventListener('change', handlecheckBox, false);

        memeBox.appendChild(checkBox);

        // Create the text for each meme
        var text = document.createElement("LABEL");
        text.setAttribute("class", "selectText");
        text.innerHTML = "Select";
        memeBox.appendChild(text);

        // Append the memeBox (now with checkbox added) to the memelist
        imageCanvas.appendChild(memeToUpload);
        // Next count should be +1 of the prior
        count++;

        // Per hw assignment, we want to make form input for the text on top and bottom to
        // be empty when meme is created
        document.getElementById("textTop").value = '';
        document.getElementById("textBottom").value = '';

        // Reset variables so that no words get placed on new picture that is uploaded
        textTop = '';
        textBottom = '';

        // Erase the URL text input box to be empty again (so user can input new URL)
        document.getElementById("imgURL").value = '';
    } // else (memeToUpload is null) do nothing
};

////////////////////////////////////////////////////////////////////////
// Draw Function
////////////////////////////////////////////////////////////////////////
// This function will "draw" the canvas, and essentially add the top 
// and bottom letters to the canvas as well
//
// Note: This portion of the code was heavily influenced by User Niels Vadot's 
// Meme generator code from their public CodePen example

function draw() {
    // uppercase both top and bottom text
    var top = textTop.toUpperCase();
    var bottom = textBottom.toUpperCase();

    // set appropriate canvas size
    // We want the picture to fit into a 300px by 300px box
    canvas.width = 300;
    canvas.height = 300 * (img.height / img.width);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var temp_textSizeTop = textSizeTop / 100 * canvas.width;
    var temp_textSizeBottom = textSizeBottom / 100 * canvas.width;

    // draw top text
    style('Impact', temp_textSizeTop, 'center', 'bottom');
    ctx.drawText(top, canvas.width / 2, temp_textSizeTop + padding, null, 1, 'fill');
    ctx.drawText(top, canvas.width / 2, temp_textSizeTop + padding, null, 1, 'stroke');

    // draw bottom text
    style('Impact', temp_textSizeBottom, 'center', 'top');
    var height = ctx.drawText(bottom, 0, 0, null, 1, 'none').textHeight;
    ctx.drawText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'fill');
    ctx.drawText(bottom, canvas.width / 2, canvas.height - padding - height, null, 1, 'stroke');
};

function style(font, size, align, base) {
    ctx.font = size + 'px ' + font;
    ctx.textAlign = align;
    ctx.textBaseline = base;

    // Give the text some shadow so that text can be seen on any picture
    ctx.shadowColor = "black";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
}

CanvasRenderingContext2D.prototype.drawText = function (str, x, y, w, lh, method) {
    // local variables and defaults
    var textSize = parseInt(this.font.replace(/\D/gi, ''));
    var textParts = [];
    var textPartsNo = 0;
    var words = [];
    var currLine = '';
    var testLine = '';

    str = str || '';
    x = x || 0;
    y = y || 0;
    w = w || this.canvas.width;
    lh = lh || 1;
    method = method || 'fill';

    // manual linebreaks
    textParts = str.split('\n');
    textPartsNo = textParts.length;

    // split the words of the parts
    for (var i = 0; i < textParts.length; i++) {
        words[i] = textParts[i].split(' ');
    }

    // now that we have extracted the words
    // we reset the textParts
    textParts = [];

    // calculate recommended line breaks
    // split between the words
    for (var i = 0; i < textPartsNo; i++) {
        // clear the testline for the next manually broken line
        currLine = '';
        for (var j = 0; j < words[i].length; j++) {
            testLine = currLine + words[i][j] + ' ';
            // check if the testLine is of good width
            if (this.measureText(testLine).width > w && j > 0) {
                textParts.push(currLine);
                currLine = words[i][j] + ' ';
            } else {
                currLine = testLine;
            }
        }
        // replace is to remove trailing whitespace
        textParts.push(currLine);
    }

    // render the text on the canvas
    for (var i = 0; i < textParts.length; i++) {
        if (method === 'fill') {
            this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
        } else if (method === 'stroke') {
            this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y + (textSize * lh * i));
        } else if (method === 'none') {
            return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
        } else {
            console.warn('drawText: ' + method + 'Text() does not exist');
            return false;
        }
    }
    return { 'textParts': textParts, 'textHeight': textSize * lh * textParts.length };
};

////////////////////////////////////////////////////////////////////////
// Text Box Handlers
////////////////////////////////////////////////////////////////////////
// Event Listeners for Text inputs to the memes

// Base Text and Text Parameters
var padding = 15;
var textTop = '';
var textBottom = '';
var textSizeTop = 10;
var textSizeBottom = 10;

document.getElementById('textTop').oninput = function (ev) {
    textTop = this.value;
    // If user starts to type when there is no canvas on screen, we don't want to draw
    // the letters
    oldMemebox = document.getElementById(`count-${count}`);
    if (!(oldMemebox === null)) {
        draw();
    }
};

document.getElementById('textBottom').oninput = function (ev) {
    textBottom = this.value;
    // If user starts to type when there is no canvas on screen, we don't want to draw
    // the letters
    oldMemebox = document.getElementById(`count-${count}`);
    if (!(oldMemebox === null)) {
        draw();
    }
};

////////////////////////////////////////////////////////////////////////
// Delete Memes
////////////////////////////////////////////////////////////////////////
// Delete meme button event lister

var imageDeleter = document.getElementById('imageDeleter');
imageDeleter.addEventListener('click', deleteImage, false);

function deleteImage() {
    // Delete all the canvas that are selected inside the imageSelected array
    imageSelected.forEach(imageID => {
        // var linkToBeRemoved = document.getElementById(`count-${count}`);
        var linkToBeRemoved = document.getElementById(imageID);
        var imageCanvas = document.getElementById('imageCanvas');
        imageCanvas.removeChild(linkToBeRemoved);
    })

    // Now that you've deleted all image from page, reset the imageSelected
    // array to be empty
    imageSelected = [];
}

////////////////////////////////////////////////////////////////////////
// Download Memes
////////////////////////////////////////////////////////////////////////
// Download meme button event lister

document.getElementById('imageDownloader').onclick = function () {
    // Download all the canvas that are selected inside the imageSelected array
    imageSelected.forEach(imageID => {
        // var linkToBeRemoved = document.getElementById(`count-${count}`);
        var linkToBeDownloaded = document.getElementById(imageID);

        // Let's grab the canvas from the memeBox link
        var canvasToBeDownloadedv = linkToBeDownloaded.childNodes[0];
        var img = canvasToBeDownloadedv.toDataURL('image/png');
        var link = document.createElement("a");
        link.download = 'My Meme';
        link.href = img;
        link.click();
    })
}

////////////////////////////////////////////////////////////////////////
// Selected Checkboxes
////////////////////////////////////////////////////////////////////////
// The selected checkboxes will dictate which memes will be deleted from 
// page or be downloaded (depending on which command button is clicked)

var imageSelected = [];

////////////////////////////////////////////////////////////////////////
// Handle Checkboxes
////////////////////////////////////////////////////////////////////////
// Function to add/delete checkbox ID to imageSelected Array

function handlecheckBox() {
    // This will give us the selected Box (parent node, to delete the whole canvasBox) ("count-xx")
    var selectedBox = this.parentNode.id;

    // Now see if you need to add/or remove selectedBox to imageSelected array
    if (this.checked === true) {
        // If it's checked, then add to imageSelected
        imageSelected.push(selectedBox);
    } else {
        // If not selected, then remove ID from imageSelected
        var boxIndex = imageSelected.indexOf(selectedBox);
        imageSelected.splice(boxIndex, 1);
    }
}
