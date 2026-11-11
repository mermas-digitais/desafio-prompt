import React from 'react';

export interface EventFloatingAssetsProps {
  variant?: 'tv' | 'mobile' | 'home';
  showBunting?: boolean;
  intensity?: 'calm' | 'excited';
}

/**
 * Cenário Arquitetural Mermãs Digitais • MDX STEAM 2026
 * Composição limpa, estática e editorial utilizando as ondas orgânicas,
 * topografia vetorial, mapa do Maranhão/Imperatriz e iluminação suave da marca,
 * sem adesivos soltos girando ou balançando na tela.
 */
export const EventFloatingAssets: React.FC<EventFloatingAssetsProps> = React.memo(
  ({ variant = 'tv' }) => {
    const isMobile = variant === 'mobile';

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0"
      >
        {/* 1. Base Luminosa Editorial com Brilhos Suaves nas Cores Oficiais */}
        <div
          className="absolute -top-36 -left-36 w-[520px] h-[520px] rounded-full opacity-55"
          style={{
            background:
              'radial-gradient(circle, rgba(221, 199, 248, 0.55) 0%, rgba(221, 199, 248, 0) 70%)',
          }}
        />
        <div
          className="absolute -top-28 -right-28 w-[560px] h-[560px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 74, 151, 0.14) 0%, rgba(255, 205, 52, 0.08) 45%, transparent 72%)',
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[680px] h-[420px] rounded-full opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 240, 237, 0.9) 0%, rgba(245, 240, 255, 0) 72%)',
          }}
        />

        {/* 2. Malha Pontilhada Editorial (Suavizada nas bordas com máscara radial) */}
        <div
          className="absolute inset-0 mdx-stage-dot-grid opacity-55"
          style={{
            maskImage:
              'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
          }}
        />

        {/* 3. Onda Orgânica Principal Mermãs Digitais (/mermas/ondas.svg) ancorada na metade inferior */}
        <img
          src="/mermas/ondas.svg"
          alt=""
          decoding="async"
          className={`absolute bottom-0 inset-x-0 w-full object-cover object-top ${
            isMobile ? 'h-[48vh] opacity-55' : 'h-[58vh] opacity-75'
          }`}
        />

        {/* 4. Linhas Topográficas Suaves (/marca/ondas.svg) cruzando o plano superior */}
        <img
          src="/marca/ondas.svg"
          alt=""
          decoding="async"
          className={`absolute top-0 inset-x-0 w-full object-cover ${
            isMobile ? 'opacity-30' : 'opacity-45'
          }`}
        />

        {/* 5. Halo Gradiente Oficial (/mermas/circulo.webp) ancorado no canto superior direito */}
        <img
          src="/mermas/circulo.webp"
          alt=""
          decoding="async"
          className={`absolute -top-24 -right-24 object-contain ${
            isMobile ? 'w-64 h-64 opacity-25' : 'w-[420px] h-[420px] opacity-35'
          }`}
        />

        {/* 6. Composição Arquitetural de Palco para TV / Widescreen (Estática e Integrada) */}
        {!isMobile && (
          <>
            {/* Marca d'água oficial do Mapa do Maranhão com Pin de Imperatriz (/mermas/mapa.svg) */}
            <img
              src="/mermas/mapa.svg"
              alt=""
              decoding="async"
              className="hidden xl:block absolute top-20 right-10 w-[300px] h-auto object-contain opacity-[0.055]"
            />

            {/* Selo STEAM em marca d'água arquitetural no canto inferior esquerdo */}
            <img
              src="/marca/selo-sozinho.svg"
              alt=""
              decoding="async"
              className="hidden xl:block absolute -bottom-10 -left-10 w-56 h-56 object-contain opacity-[0.06]"
            />

            {/* Recorte de Onda Branca Superior (/mermas/ondasTimer.svg) dando acabamento junto ao Header */}
            <img
              src="/mermas/ondasTimer.svg"
              alt=""
              decoding="async"
              className="hidden lg:block absolute top-[54px] left-1/2 -translate-x-1/2 w-[680px] max-w-full object-contain opacity-65"
            />
          </>
        )}
      </div>
    );
  }
);
