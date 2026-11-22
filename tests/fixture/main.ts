import { mount } from 'svelte';
import Fixture from './Fixture.svelte';
import 'suite-shell/styles.css';

const target = document.getElementById('app');
if (target) mount(Fixture, { target });
