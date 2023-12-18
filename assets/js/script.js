document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const RENDER_EVENT = 'render_books';

  function loadDataFromStorage() {
    const booksJSON = localStorage.getItem('books');
    if (booksJSON) {
      books = JSON.parse(booksJSON);
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }

  function saveData() {
    const booksJSON = JSON.stringify(books);
    localStorage.setItem('books', booksJSON);
  }

  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const generateID = bookId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, isComplete);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  

  function bookId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    };
  }

  let books = [];

  document.addEventListener(RENDER_EVENT, function () {
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    incompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = createBook(bookItem);
      if (!bookItem.isCompleted) incompletedBookList.appendChild(bookElement);
      else completedBookList.appendChild(bookElement);
    }
  });

  function createBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear);

    const actionButton = document.createElement('button');
    actionButton.innerText = bookObject.isCompleted ? 'Belum Selesai Dibaca' : 'Sudah Selesai';
    actionButton.classList.add('green');

    actionButton.addEventListener('click', function () {
      if (bookObject.isCompleted) {
        undoBookIsCompleted(bookObject.id);
      } else {
        addBookIsCompleted(bookObject.id);
      }
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Hapus Buku';
    removeButton.classList.add('red');

    removeButton.addEventListener('click', function () {
      removeBookIsCompleted(bookObject.id);
    });

    container.append(actionButton, removeButton);

    return container;
  }

  function addBookIsCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoBookIsCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBookIsCompleted(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id == bookId) {
        return index;
      }
    }

    return -1;
  }

  const checkbox = document.getElementById('inputBookIsComplete');

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      check = true;

      document.querySelector("span").innerText = "Selesai dibaca";
    } else {
      check = false;

      document.querySelector("span").innerText = "Belum selesai dibaca";
    }

  });

  document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (const book of bookList) {
      const container = book.parentElement.parentElement;
      const displayStyle = book.innerText.toLowerCase().includes(searchBook) ? 'block' : 'none';
      container.style.display = displayStyle;
    }
  });

  loadDataFromStorage();
});
