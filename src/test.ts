import test from 'ava';
import '@k2oss/k2-broker-core/test-framework';
import './index';

function mock(name: string, value: any) 
{
    global[name] = value;
}

test('no tests', async t => {
    t.pass('there are currently no tests in this sample');
});