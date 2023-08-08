const chart = document.querySelector("#chart").getContext('2d');

// create a new chart instance

new Chart(chart, {
    type: 'line',
    data: {
        labels:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
        datasets: [
            {
                label: 'income',
                data: [0,0,0,0,42658,32475,67425],
                borderColor: 'red',
                borderWidth: 2
            },
            {
                label: 'expenses',
                data: [0,0,0,0,32658,42475,87425],
                borderColor: 'blue',
                borderWidth: 2
            }
        ]
    },
    options: {
        responsive: true,
    }
});


// show or hide side bar
const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');


menuBtn.addEventListener('click',() => {
    sidebar.style.display = 'block';
})

closeBtn.addEventListener('click',() => {
    sidebar.style.display = 'none';
})


// change theme


