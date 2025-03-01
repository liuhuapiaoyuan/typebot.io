import { TypingBubble } from '@/components'
import type { AudioBubbleContent } from '@typebot.io/schemas'
import { createSignal, onCleanup, onMount } from 'solid-js'

type Props = {
  url: AudioBubbleContent['url']
  onTransitionEnd: (offsetTop?: number) => void
}

const showAnimationDuration = 400
const typingDuration = 500

let typingTimeout: NodeJS.Timeout

export const AudioBubble = (props: Props) => {
  let ref: HTMLDivElement | undefined
  const [isTyping, setIsTyping] = createSignal(true)

  onMount(() => {
    typingTimeout = setTimeout(() => {
      setIsTyping(false)
      setTimeout(() => {
        const audioElement = ref?.querySelector('audio')
        if (audioElement)
          audioElement
            .play()
            .catch((e) => console.warn('Could not autoplay the audio:', e))
        props.onTransitionEnd(ref?.offsetTop)
      }, showAnimationDuration)
    }, typingDuration)
  })

  onCleanup(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
  })

  return (
    <div class="flex flex-col animate-fade-in" ref={ref}>
      <div class="flex w-full items-center">
        <div class={'flex relative z-10 items-start typebot-host-bubble'}>
          <div
            class="flex items-center absolute px-4 py-2 bubble-typing z-10 "
            style={{
              width: isTyping() ? '64px' : '100%',
              height: isTyping() ? '32px' : '100%',
            }}
          >
            {isTyping() && <TypingBubble />}
          </div>
          <audio
            src={props.url}
            class={
              'z-10 text-fade-in m-2 ' +
              (isTyping() ? 'opacity-0' : 'opacity-100')
            }
            style={{ height: isTyping() ? '32px' : 'revert' }}
            controls
          />
        </div>
      </div>
    </div>
  )
}
