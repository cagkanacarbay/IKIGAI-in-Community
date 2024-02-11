import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const driverObj = driver({
    showProgress: false,
    allowClose: false,
    steps: [
        {
            element: ".tlui-icon",
            popover: {
                title: "Main Menu",
                description: "You can control something here"
            }
        },
        {
            element: '.tlui-toolbar__tools',
            popover: {
                title: "Toolbar",
                description: "You can control the tools you have here"
            }
        },
        {
            element: ".tl-text",
            popover: {
                title: "Aspects",
                description: "You can create aspects and place them in any circle you want. The aspects color will change depending on the circle it is in."
            }
        },
        {
            element: ".tlui-help-menu",
            popover: {
                title: "Help Menu",
                description: "Click this one"
            }
        },
        {
            element: ".tlui-menu__group",
            popover: {
                title: "Help Menu",
                description: "Here you can change language and find useful shortcuts."
            }
        }
    ]
});

export default function DemoTour() {
    driverObj.drive()
}
