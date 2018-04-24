import { Section, Test, Repeated, Parameterized, DescribeTest } from "../decorators/core.decorators";
import { expect } from 'chai'


@Section('String')
export class StringTest{


    @DescribeTest('2 Str. should be equal')
    protected testEquality(name1: string, name23: string){
       expect(name1).to.be.equal(name23);
    }

    @DescribeTest('2 Str. should be equal asdasasddddddddddddddd')
    protected testKek(name1: string, name23: string){
       expect(name1).to.be.equal(name23);
    }


  
    @DescribeTest('2 Str. should be equal asdas123             s 123 1 123 d  s')
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
    @DescribeTest('2 Str. should be equal')
    protected testEqualit2y(obj: any, obj1: any){
       expect(obj).to.be.equal(obj1);
    }
    

}