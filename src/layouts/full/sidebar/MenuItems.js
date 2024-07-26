import {
   IconLayoutDashboard,
   IconAperture
   
} from '@tabler/icons';
import { IoIosPricetags } from "react-icons/io";
import { BsQuestionOctagon } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
import { IoStatsChart } from "react-icons/io5";



import { FaUsersLine } from "react-icons/fa6";

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'List of Users',
    icon: FaUsersLine,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Liste of Tags',
    icon: IoIosPricetags,
    href: '/listoftags',
  },
  {
    id: uniqueId(),
    title: 'Liste of Questions',
    icon: BsQuestionOctagon,
    href: '/listQuestions',
  },
  {
    navlabel: true,
    subheader: 'Ajouter',
  },
  {
    id: uniqueId(),
    title: 'Ajouter Moderateur',
    icon: IoPersonAdd,
    href: '/ajoutermoderateur',
  },
  {
    navlabel: true,
    subheader: 'Analytics',
  },
  {
    id: uniqueId(),
    title: 'Admin Stats',
    icon: IoStatsChart,
    href: '/stat',
  },

  
  
];

export default Menuitems;
