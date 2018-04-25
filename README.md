# USentry
Progressive, interactive TypeScript framework for unit testing using decorators.

[![Dashboard](https://i.imgur.com/cnrLOnE.png "Dashboard")](https://i.imgur.com/cnrLOnE.png "Dashboard")

```typescript
import { Section, DescribeTest, Parameterized } from 'usentry'
import { expect } from 'chai'

@Section('String')
export class StringTest{

    @DescribeTest('2 strings should be equals')
    @Parameterized(["1","1"], ["3","3"])
    equality(str1: string, str2: string){
        expect(str1).to.be.equals(str2);
    }
}
```


### Getting Started
```bash
npm install usentry --save-dev
npm install usentry-cli -g
```
