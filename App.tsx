/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';

import HelloWorld from './src/components/demobuoi1/HelloWorld'
import Baitap3 from './src/components/demobuoi1/Baitap3'
import Baitap1 from './src/components/buoi3/Baitap1'
import vidu2_props from './src/components/demobuoi1/vidu2_props'
import LinearSolver from './src/components/demobuoi1/vidu2_props';
import Homework from './src/components/buoi4/Homework'
import BMIApp from './src/components/buoi5/BMIApp';
import Layout from './src/components/buoi6/Layout';
import BMICalculator from './src/components/buoi7/BMICalculator';
import ProductCard2 from './src/components/buoi8/ProductCard2';
import StudentList from './src/components/buoi9/StudentList';
import ContactApp from './src/components/buoi10Test/ContactApp'

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function App(): JSX.Element {


  return (
    // <HelloWorld />
    // <Baitap3 />
    // <Baitap1 />
    // <LinearSolver/>
    // <Homework/>
    // <BMIApp />
    // <Layout/>
    // <BMICalculator/>
      // <ProductCard2/>
    // <StudentList/>
    <ContactApp />
    
  );
}



export default App;
