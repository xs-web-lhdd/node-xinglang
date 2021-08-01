/**
 * @description test demo
 * @author 凉风有信、
 */

function sum(a, b) {
    return a + b
}

test('10 + 20 should tobe 30', () => {
    const res = sum(10,20)

// 断言
    // 第一种：
    expect(res).toBe(30)
    // 第二种：
    // expect(res).not.toBe(40)
})
