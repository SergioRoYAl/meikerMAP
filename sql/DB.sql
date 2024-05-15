-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-05-2024 a las 14:52:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservarea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ap`
--

CREATE TABLE `ap` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_zona` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `mac` varchar(64) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_isleta` bigint(20) NOT NULL,
  `prefijo` varchar(6) NOT NULL,
  `posicion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`id`, `nombre`, `mac`, `x`, `y`, `id_isleta`, `prefijo`, `posicion`) VALUES
(2020, '', '00:00:00:00:00:00', 103, 86, 313, 'LLL', 1),
(2060, '', '00:00:00:00:00:00', 262, 183, 314, 'GAAN', 1),
(2063, '', '00:00:00:00:00:00', 500, 193, 314, 'GAAN', 2),
(2064, '', '00:00:00:00:00:00', 375, 78, 314, 'GAAN', 3),
(2067, '', '00:00:00:00:00:00', 151, 325, 314, 'GAAN', 4),
(2068, '', '00:00:00:00:00:00', 328, 299, 314, 'GAAN', 5),
(2069, '', '00:00:00:00:00:00', 455, 277, 314, 'GAAN', 6),
(2070, '', '00:00:00:00:00:00', 177, 86, 313, 'LLL', 2),
(2071, '', '00:00:00:00:00:00', 6, 86, 313, 'LLL', 3),
(2074, '', '00:00:00:00:00:00', 193, 12, 313, 'LLL', 4),
(2075, '', '00:00:00:00:00:00', 230, 175, 315, 'GAAN', 1),
(2076, '', '00:00:00:00:00:00', 453, 226, 315, 'GAAN', 2),
(2077, '', '00:00:00:00:00:00', 456, 90, 315, 'GAAN', 3),
(2079, '', '00:00:00:00:00:00', 85, 98, 315, 'GAAN', 4),
(2080, '', '00:00:00:00:00:00', 49, 213, 315, 'GAAN', 5),
(2081, '', '00:00:00:00:00:00', 51, 290, 315, 'GAAN', 6),
(2082, '', '00:00:00:00:00:00', 158, 316, 315, 'GAAN', 7),
(2083, '', '00:00:00:00:00:00', 298, 303, 315, 'GAAN', 8),
(2084, '', '00:00:00:00:00:00', 430, 296, 315, 'GAAN', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `isleta`
--

CREATE TABLE `isleta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `height` bigint(20) NOT NULL,
  `width` bigint(20) NOT NULL,
  `x` bigint(20) NOT NULL,
  `y` bigint(20) NOT NULL,
  `id_zona` bigint(20) NOT NULL,
  `prefijo` varchar(4) NOT NULL,
  `redonda` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `isleta`
--

INSERT INTO `isleta` (`id`, `nombre`, `height`, `width`, `x`, `y`, `id_zona`, `prefijo`, `redonda`) VALUES
(312, 'Holaaa', 191, 331, 559, 237, 241, 'HOL', 0),
(313, 'llll', 132, 244, 424, 94, 242, 'LLL', 0),
(314, 'gaaa', 421, 566, 743, 112, 242, 'GAAN', 0),
(315, 'gaaa', 404, 539, 135, 245, 242, 'GAAN', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zona`
--

CREATE TABLE `zona` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `height` bigint(20) NOT NULL,
  `width` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zona`
--

INSERT INTO `zona` (`id`, `nombre`, `height`, `width`) VALUES
(241, 'PepeZone', 721, 1533),
(242, '', 763, 1760),
(243, '', 678, 1134);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ap`
--
ALTER TABLE `ap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ap_zona` (`id_zona`);

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_etiqueta_isleta` (`id_isleta`);

--
-- Indices de la tabla `isleta`
--
ALTER TABLE `isleta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_isleta_zona` (`id_zona`);

--
-- Indices de la tabla `zona`
--
ALTER TABLE `zona`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ap`
--
ALTER TABLE `ap`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2085;

--
-- AUTO_INCREMENT de la tabla `isleta`
--
ALTER TABLE `isleta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=319;

--
-- AUTO_INCREMENT de la tabla `zona`
--
ALTER TABLE `zona`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ap`
--
ALTER TABLE `ap`
  ADD CONSTRAINT `fk_ap_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD CONSTRAINT `fk_etiqueta_isleta` FOREIGN KEY (`id_isleta`) REFERENCES `isleta` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `isleta`
--
ALTER TABLE `isleta`
  ADD CONSTRAINT `fk_isleta_zona` FOREIGN KEY (`id_zona`) REFERENCES `zona` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
