import Home from 'home/components/Home';
import {render} from 'react-dom';
import React from 'react';

import 'home/css/home.scss';

render(<Home user={app.user} />, document.getElementById('mount'));
