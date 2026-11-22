import { mount } from 'svelte';
import Fixture from './Fixture.svelte';
import '../../src/styles.css';

const target = document.getElementById('app');
if (target) mount(Fixture, { target });
