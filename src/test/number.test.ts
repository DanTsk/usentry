import { Section, Test, Repeated, Parameterized, DescribeTest } from "../decorators/core.decorators";
import { expect } from 'chai'


@Section('Number')
export class StringTest{


    @DescribeTest('2 Str. should be equal')
    protected testEquality(name1: string, name23: string){
       expect(name1).to.be.equal(name23);
    }

    @DescribeTest('2 Str. should be equal asdasasdddddddddddd 22  213 ddd')
    protected testKek(name1: string, nameddd23: string){
       console.log('asdasdasddddddddddddddddddddddddddasdasdasddddddsssdddddddd') 
       expect(name1).to.be.equal(nameddd23);
    }


  
    @DescribeTest('2 Str. should be equal asdas123d')
    protected testsKek(name1: string, name23: string){
       expect(name1).to.be.equal(name23);
    }


    
    @Parameterized([ 
        {
            name: "Dan",
            age: 19
        },
        {
            name: "Valerii",
            age: 19
        }
    ])
    @DescribeTest('2 Str. should be equal ....... sss')
    protected testEqualit2y(obj: any, obj1: any){
       console.log('asdasd');
       expect(obj).to.be.equal(obj1);
    }
    

}