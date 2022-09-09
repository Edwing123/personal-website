class WritingCursor extends HTMLElement {
    static tagName = 'writing-cursor'
    static attributes = ['state']

    #root: ShadowRoot

    constructor() {
        super()
        this.#root = this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.#root.innerHTML = [this.styles, this.render].join('')
    }

    get styles() {
        return `
        <style>
            span {
                display: inline-block;
                height: 50px;
                width: 3px;

                background-color: #3b5441;
                animation-name: blink;
                animation-duration: 500ms;
                animation-iteration-count: infinite;
            }

            :host([data-state="blinking"]) span {
                animation-name: blink;
            }

            :host([data-state="stopped"]) span {
                animation-name: none;
            }

            @keyframes blink {
                from {
                    // opacity: 1;
                    transform: scaleX(0);
                }

                to {
                    transform: scaleX(1);
                    // opacity: 0;
                }
            }
        </style>
        `
    }

    get render() {
        return `
        <span aria-hidden="true"></span>
        `
    }
}

customElements.define(WritingCursor.tagName, WritingCursor)

type Options = {
    $el: HTMLElement
    words: string[]
    initial: string
    duration?: number
}

type State = 'writing' | 'erasing'

class WritingAnimation {
    #$el: HTMLElement
    #$cursor: HTMLElement
    #words: string[] = []
    #duration: number
    #state: State = 'erasing'
    #stack: string[] = []
    #index: number = 0
    #word: string = ''
    #timeOutId: number = 0

    constructor(options: Options) {
        this.#$el = options.$el
        this.#words = options.words
        this.#duration = options.duration ?? 200
        this.#$cursor = document.createElement('writing-cursor')

        this.#$el.insertAdjacentElement('afterend', this.#$cursor)
        this.#$cursor.dataset.state = 'stopped'
        options.initial.split('').forEach((letter) => this.#write(letter))
    }

    #getWord() {
        const words = this.#words
        const i = Math.floor(Math.random() * words.length)
        return words[i]
    }

    #write(letter: string) {
        this.#stack.push(letter)
    }

    #erase() {
        this.#stack.pop()
    }

    async #startBlinking() {
        this.#$cursor.dataset.state = 'blinking'
        await this.#sleep(4000)
        this.#$cursor.dataset.state = 'stopped'
    }

    async #next() {
        const stackLength = this.#stack.length

        if (stackLength === 0) {
            this.#state = 'writing'
            this.#index = 0
            this.#word = this.#getWord()
        }

        if (stackLength === this.#word.length) {
            this.#state = 'erasing'
            await this.#startBlinking()
        }

        this.#loop()
    }

    #sleep(time: number) {
        return new Promise<void>((r) => {
            setTimeout(() => r(), time)
        })
    }

    #loop() {
        this.#timeOutId = setTimeout(async () => {
            switch (this.#state) {
                case 'writing': {
                    const letter = this.#word[this.#index]
                    this.#index += 1
                    this.#write(letter)
                    break
                }

                case 'erasing': {
                    this.#erase()
                    break
                }
            }

            this.#$el.textContent = this.#stack.join('')
            await this.#next()
        }, this.#duration)
    }

    start() {
        this.#loop()
    }
}

export { WritingAnimation }
