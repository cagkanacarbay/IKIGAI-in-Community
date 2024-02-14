import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';


const driverObj = driver({
    showProgress: false,
    allowClose: true,
    steps: [
        {
            element: ".tlui-icon",
            popover: {
                title: "Main Menu",
                description: "You can save, print your Ikigai. You can also change your preferences here"
            }
        },
        {
            element: '.tlui-toolbar__tools',
            popover: {
                title: "Toolbar",
                description: "You can control, add, and edit the tools you have here"
            }
        },
        {
            // I use part of the className here. If it can have a specific ID, it would be better.
            element: ".shadow-inner",
            popover: {
                title: "Aspects",
                description: "You can create aspects and place them in any circle you want. The aspects color will change depending on the circle it is in."
            }
        },
        {
            element: ".tlui-help-menu",
            popover: {
                title: "Help Menu",
                description: "You can browse shortcuts and change language here."
            }
        },
        {
            element: ".tlui-navigation-zone",
            popover: {
                title: "Navigation Panel",
                description: "You can adjust zoom level and see the map here."
            }
        },
        {
            element: ".tlui-style-panel",
            popover: {
                title: "Style Panel",
                description: "you can configure your assets in this panel."
            }
        },
        {
            // I used a part of the className of the button. If you can add an id to the element, it would be much better.
            // classNames begin with . and ids begin with #. Example below.
            // element: "#idName" 
            element: ".cursor-pointer",
            popover: {
                title: "Tutorial",
                description: "You can begin your Journey here."
            }
        }
    ]
});

export default function DemoTour() {
    driverObj.drive()
}
