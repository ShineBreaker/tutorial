# 形式化方法的边界，以及 /statechart skill

- 作者：lauren（[@poteto](https://x.com/poteto)）
- 整理来源：X 收藏，同时出现在点赞中
- 原帖：[https://x.com/poteto/status/2118416074601545968](https://x.com/poteto/status/2118416074601545968)
- 发布：2026-11-05 15:52（America/Fortaleza）
- 类型：长帖笔记

---
while i'm quite bullish on formal methods, i think it's worth tempering expectations and doing your own research on it (disclaimer: i am not an expert in it). it cannot guarantee your code is bug free, only that it matches the spec under certain assumptions, and the specs come from what people want, not math. as long as we build software for humans, nothing can prove that your spec is right, only you can judge.

i created the /statechart skill in pstack primarily because it helps make the state machines implicit in your code more obvious and legible to you, so you can shrink the review surface and review the work at a higher level: does it actually match your intent and goal? i used this skill a ton while building my game https://t.co/sa18sM28uD, below you can see the statechart for story mode where i was able to find many bugs with it. 

in that sense, i think model checking (eg TLA+ with TLC) is quite useful for understanding and checking properties of your system e2e, and you don't have to write tons of new verification code for it. the spec isn't your actual code so there's always a risk of drift, but so far i've had good experiences finding actual bugs with it. i tend to pair it with empirical verification (running the code) also to confirm it's real 

other types of formal verification like proving theorems (eg Lean, Dafny), bounded model checking (eg CBMC, Kani) etc have their own tradeoffs. proofs cover every possible input, but only for the properties specified, and it takes a lot more code/work. bounded model checking can run on your actual code, which avoids drift, but it only checks up to a certain number of steps, so it's better at finding bugs than proving there aren't any

so i think in the near-medium term you'll still need to layer your codebase: constraints and guardrails (types, lint rules, api design, refactoring), empirical verification (tests, evals, real usage), and formal verification for the parts that really need it. none of these catch everything on their own, but layered  together, they catch a lot more and shrink what's left for you to review

but also maybe in the limit, the bitter lesson will prevail and flawless code will just be printed out perfectly every time with no bugs. even in that scenario, /statechart still seems very helpful in confirming that the agent understood your intent correctly. give it a try if you haven't already! 

https://t.co/9erGZLOzxO
